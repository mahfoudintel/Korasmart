import Link from "next/link";

export function FootballLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500">
      <div className="grid h-13 w-13 shrink-0 place-items-center rounded-full border border-lime-300/70 bg-white/78 shadow-[0_12px_30px_rgba(47,158,47,.16)]">
        <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
          <circle cx="32" cy="32" r="29" fill="#f8fff1" />
          <path d="M12 46c9-7 23-8 40-3" fill="none" stroke="#8ce23a" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M18 51c11-5 24-5 36-1" fill="none" stroke="#d8f8b8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45.2" cy="17.8" r="5.4" fill="#0f172a" />
          <path d="M36.4 27.6 45 23.2l6.7 8.4" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36.2 28 27.8 40.6" fill="none" stroke="#0f172a" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M33.8 31.8 22.4 28" fill="none" stroke="#2f9e2f" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M29 40.2 39.6 49" fill="none" stroke="#0f172a" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M27.6 41 17.2 47.4" fill="none" stroke="#2f9e2f" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="14.5" cy="49.5" r="6.2" fill="#fff" stroke="#0f172a" strokeWidth="2.2" />
          <path d="m12.2 45.8 4.5 1.2 1 4.6-3.6 3-4.3-2 1-4.5z" fill="#0f172a" />
        </svg>
      </div>
      <div className="text-[1.26rem] font-black italic leading-none text-slate-950">
        KORA<span className="text-[#2f9e2f]">SMART</span>
      </div>
    </Link>
  );
}
