import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function FootballLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="block rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500">
      <Image
        src="/images/korasmart-logo-transparent.png"
        alt="KORASMART"
        width={320}
        height={320}
        priority
        className={cn("w-full object-contain", compact ? "h-16" : "h-36")}
      />
    </Link>
  );
}
