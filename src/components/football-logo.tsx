import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function FootballLogo({ compact = false, inverse = false, mobileTight = false }: { compact?: boolean; inverse?: boolean; mobileTight?: boolean }) {
  const logoSrc = inverse ? "/images/korasmart-orange-logo-inverse.png" : "/images/korasmart-orange-logo-light.png";

  return (
    <Link
      href="/"
      aria-label="KORASMART Home"
      className={cn(
        "inline-flex items-center rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500",
        !compact && "w-full",
      )}
    >
      <span
        className={cn(
          "relative block shrink-0",
          inverse ? "h-14 w-[154px]" : "h-16 w-[230px]",
          compact && (inverse ? "h-12 w-[132px]" : "h-12 w-[178px]"),
          mobileTight && "h-12 w-[min(42vw,178px)] sm:w-[178px]"
        )}
      >
        <Image
          src={logoSrc}
          alt="KORASMART"
          fill
          priority
          sizes={mobileTight ? "(max-width: 640px) 42vw, 178px" : compact ? "178px" : "230px"}
          className="object-contain drop-shadow-[0_4px_8px_rgba(1,18,31,.18)]"
        />
      </span>
    </Link>
  );
}
