import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "glass-panel rounded-[20px] p-4 text-slate-950",
        className
      )}
      {...props}
    />
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-sm font-black uppercase tracking-[.02em] text-slate-700", className)}>{children}</h2>;
}
