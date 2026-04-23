import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-mono uppercase tracking-wider text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cyber-chamfer-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground hover:shadow-neon",
        secondary:
          "border-2 border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-neon-secondary",
        outline:
          "border border-border bg-transparent hover:border-accent hover:text-accent hover:shadow-neon",
        ghost:
          "bg-transparent hover:bg-accent/10 hover:text-accent",
        glitch:
          "bg-accent text-accent-foreground hover:brightness-110 cyber-glitch shadow-neon-sm",
        destructive:
          "border-2 border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 px-6 py-2",
        xs: "h-7 px-3 text-xs",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "size-11",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
