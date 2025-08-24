
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import LinearGradient from 'react-native-linear-gradient';

interface LiquidGlassProps {
  size?: number;
  children?: React.ReactNode;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({ size = 320, children }) => {
  return (
    <View style={[styles.shadowContainer, { width: size, height: size }]}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* 1. Base Blur Layer */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
        />

        {/* 2. Depth: Radial Gradient Edges */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 3. Liquid Streak (Horizontal) */}
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ rotate: '-30deg' }, { scale: 1.5 }] },
          ]}
        />
        
        {/* 4. Liquid Streak (Vertical) */}
         <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ rotate: '45deg' }, { scale: 1.2 }] },
          ]}
        />

        {/* 5. Shine: Top-Left Specular Highlight */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={[styles.shine, { width: size, height: size }]}
        />
        
        {/* Border */}
        <View style={styles.border} />

        {/* 6. Children Content */}
        <View style={styles.contentContainer}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    // 6. Glow Effect (Shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 24,
  },
  container: {
    borderRadius: 9999, // Perfect circle
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 9999,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.8,
  },
  contentContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LiquidGlass;
