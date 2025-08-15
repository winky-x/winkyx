
"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Geometry } from "ogl";

// A simple fragment shader that uses the CPPN function to create a flowing, organic pattern
const fragment = `#version 300 es
    precision highp float;
    out vec4 FragColor;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform float hueShift;
    uniform float noiseIntensity;
    uniform float scanlineIntensity;

    // CPPN function
    vec3 cppn_fn(vec3 p) {
        float scale = 3.;
        vec3 a = p;
        for (int i = 0; i < 3; i++) {
            a.xz = a.xz * mat2(cos(uTime * 0.1), -sin(uTime * 0.1), sin(uTime * 0.1), cos(uTime * 0.1));
            a.xy = a.xy * mat2(cos(uTime * 0.2), -sin(uTime * 0.2), sin(uTime * 0.2), cos(uTime * 0.2));
            a.yz = a.yz * mat2(cos(uTime * 0.3), -sin(uTime * 0.3), sin(uTime * 0.3), cos(uTime * 0.3));
            a = abs(a) / dot(a, a) - 0.5;
            a = a * scale;
        }
        return a;
    }

    // A simple color shift function
    vec3 hueShiftRGB(vec3 rgb, float hue) {
      const vec3 k = vec3(0.57735, 0.57735, 0.57735);
      float cos_val = cos(hue);
      return rgb * cos_val + cross(k, rgb) * sin(hue) + k * dot(k, rgb) * (1.0 - cos_val);
    }
    
    // Simple noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 p = uv - 0.5;
        p.x *= uResolution.x / uResolution.y;

        vec3 cppn_out = cppn_fn(vec3(p, uTime * 0.1));

        // Use the output of CPPN to generate a color
        vec3 col = sin(cppn_out) * 0.5 + 0.5;
        
        // Apply a base hue shift
        col = hueShiftRGB(col, hueShift);

        // Apply a slight gradient
        col *= smoothstep(0.0, 1.0, 1.0 - length(p));
        
        // Add noise for a subtle grainy effect
        float noise = random(gl_FragCoord.xy) * noiseIntensity;
        col -= vec3(noise);

        // Add scanlines for a CRT-like effect
        float scanline = sin(gl_FragCoord.y * 500.0) * scanlineIntensity * 0.05;
        col -= vec3(scanline);

        FragColor = vec4(col, 1.0);
    }
`;

interface DarkVeilProps {
  speed?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  hueShift?: number;
}

const DarkVeil: React.FC<DarkVeilProps> = ({
  speed = 0.5,
  noiseIntensity = 0.5,
  scanlineIntensity = 0.5,
  hueShift = -1.2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    const gl = renderer.gl;

    containerRef.current.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: `#version 300 es
                in vec2 position;
                void main() {
                  gl_Position = vec4(position, 0, 1);
                }`,
      fragment: fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        hueShift: { value: hueShift },
        noiseIntensity: { value: noiseIntensity },
        scanlineIntensity: { value: scanlineIntensity },
      },
    });

    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
    });
    
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (containerRef.current) {
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      }
    };

    window.addEventListener("resize", resize);
    resize();

    let lastTime = performance.now();
    const animate = (t: number) => {
      const deltaTime = t - lastTime;
      lastTime = t;
      
      program.uniforms.uTime.value += deltaTime * 0.0005 * speed;

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (containerRef.current && gl.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // The renderer does not have a destroy method.
      // Removing the canvas and stopping the animation frame is sufficient.
    };
  }, [speed, noiseIntensity, scanlineIntensity, hueShift]);

  return (
    <div
      ref={containerRef}
      className="dark-veil-container w-full h-full"
    ></div>
  );
};

export default DarkVeil;
