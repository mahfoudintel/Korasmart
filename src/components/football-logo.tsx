import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function FootballLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KORASMART Home"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500",
        compact ? "gap-2" : "w-full",
      )}
    >
      <span className={cn("relative shrink-0", compact ? "h-11 w-11" : "h-14 w-14")}>
        <Image
          src="/images/korasmart-sport-tech-logo.png"
          alt=""
          fill
          priority
          sizes={compact ? "44px" : "56px"}
          className="object-contain"
        />
      </span>
      <span className={cn("min-w-0 whitespace-nowrap text-[1.34rem] font-black italic leading-none tracking-normal", inverse ? "text-white" : "text-slate-950")}>
        KORA<span className="text-[#2f9e2f]">SMART</span>
      </span>
    </Link>
  );
}
