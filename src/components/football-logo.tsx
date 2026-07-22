import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function FootballLogo({ compact = false, inverse = false, mobileTight = false }: { compact?: boolean; inverse?: boolean; mobileTight?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KORASMART Home"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500",
        compact ? "gap-2" : "w-full",
        mobileTight && "gap-2",
      )}
    >
      <span className={cn("relative shrink-0", compact ? "h-11 w-12" : "h-14 w-[60px]", mobileTight && "h-9 w-10 sm:h-11 sm:w-12")}>
        <Image
          src="/images/korasmart-sport-tech-logo-cutout.png"
          alt=""
          fill
          priority
          sizes={mobileTight ? "(max-width: 640px) 40px, 48px" : compact ? "48px" : "60px"}
          className="object-contain drop-shadow-[0_4px_8px_rgba(1,18,31,.18)]"
        />
      </span>
      <span className={cn("min-w-0 whitespace-nowrap text-[1.34rem] font-black italic leading-none tracking-normal", mobileTight && "text-[clamp(1rem,6vw,1.34rem)]", inverse ? "text-white" : "text-slate-950")}>
        KORA<span className="text-[#2f9e2f]">SMART</span>
      </span>
    </Link>
  );
}
