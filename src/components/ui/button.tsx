import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-lime-300 text-black shadow-[0_0_28px_rgba(200,255,26,.24)] hover:bg-lime-200",
        glass: "border border-white/10 bg-white/5 text-white hover:border-lime-300/50 hover:text-lime-200",
        orange: "bg-orange-500 text-white shadow-[0_0_26px_rgba(255,122,0,.22)] hover:bg-orange-400"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        icon: "h-11 w-11 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
