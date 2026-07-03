import Link from "next/link";
import { cn } from "@/lib/utils";

function FootballMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className={cn("shrink-0 drop-shadow-[0_8px_18px_rgba(29,78,216,0.12)]", className)}
      fill="none"
    >
      <path d="M79.5 30.8A36.2 36.2 0 0 1 26.8 80" stroke="#8fdc3f" strokeWidth="7" strokeLinecap="round" />
      <path d="M18.5 64.2A36 36 0 0 1 68.7 16.8" stroke="#10223a" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 76.5c14.2 5.2 31.8 1.6 43.2-10.5" stroke="#35ad37" strokeWidth="4" strokeLinecap="round" />
      <circle cx="21.5" cy="20.5" r="5.4" fill="#7dcc38" />
      <circle cx="72.5" cy="70.5" r="10" fill="#fff" stroke="#10223a" strokeWidth="2.4" />
      <path d="m72.5 62.3 4.9 3.5-1.9 5.8h-6l-1.9-5.8 4.9-3.5Z" fill="#10223a" />
      <path
        d="m63.8 69.4 3.8-3.6m10 0 3.8 3.6m-5.9 2.2 1.4 5m-8.8 0 1.4-5"
        stroke="#10223a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="44.2" cy="29.5" r="6.2" fill="#10223a" />
      <path
        d="M36 42.2c5-4.2 10.8-4.9 17.1-2.2l5.3 2.3 10.3-5.6"
        stroke="#10223a"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m45.4 40.8 4.7 19.5 12.4 8.2"
        stroke="#10223a"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43.7 43.2 31.5 55.6l-11.2 2.7"
        stroke="#10223a"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m49 46.4 10.2 4.4" stroke="#89dd38" strokeWidth="5" strokeLinecap="round" />
      <path d="m38.4 49.6 6.5 9.8" stroke="#89dd38" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function FootballLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KORASMART Home"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500",
        compact ? "gap-2" : "w-full",
      )}
    >
      <FootballMark className={compact ? "h-11 w-11" : "h-[76px] w-[76px]"} />
      <span className="min-w-0 whitespace-nowrap text-[1.62rem] font-black italic leading-none tracking-normal text-slate-950">
        KORA<span className="text-[#2f9e2f]">SMART</span>
      </span>
    </Link>
  );
}
