import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-[20px] border border-white/18 bg-white/[.08] p-4 shadow-[0_14px_42px_rgba(0,0,0,.18)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-sm font-black uppercase tracking-[.02em] text-white", className)}>{children}</h2>;
}
