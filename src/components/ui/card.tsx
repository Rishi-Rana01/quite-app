import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col overflow-hidden cyber-chamfer border transition-all duration-300 text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card border-border hover:border-accent hover:-translate-y-[1px] hover:shadow-neon",
        terminal: "bg-background border-border hover:border-accent hover:shadow-neon",
        holographic: "bg-muted/30 border-accent/30 shadow-neon backdrop-blur-sm",
      },
      size: {
        default: "py-4 gap-4",
        sm: "py-3 gap-3",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  withTerminalHeader?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, withTerminalHeader, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        data-size={size}
        className={cn(cardVariants({ variant, size, className }))}
        {...props}
      >
        {withTerminalHeader || variant === "terminal" ? (
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 border-b border-border/50 bg-muted/20">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
        ) : null}
        {props.children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 px-4", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-heading uppercase tracking-wide text-lg font-semibold leading-none text-foreground", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center px-4 border-t border-border bg-muted/20 mt-auto pt-4 pb-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
