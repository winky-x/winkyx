import * as React from "react"
import { cn } from "@/lib/utils"

const GlassPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col rounded-2xl border border-white/10 bg-card/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-lg",
      // Adding a subtle gradient border effect
      "relative bg-clip-padding before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50 before:content-['']",
      className
    )}
    {...props}
  />
));
GlassPanel.displayName = "GlassPanel"

export { GlassPanel }
