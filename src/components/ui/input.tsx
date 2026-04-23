import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono text-sm select-none pointer-events-none">
          {">"}
        </span>
        <input
          type={type}
          className={
            "flex h-11 w-full cyber-chamfer-sm border border-border bg-input px-3 pl-8 py-2 text-sm font-mono text-accent transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:font-mono focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
          }
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
