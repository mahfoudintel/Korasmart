import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="KoraSmart home">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center sm:h-12 sm:w-12">
        <span className="absolute h-9 w-9 rounded-full border-2 border-lime-300 shadow-[0_0_22px_rgba(200,255,26,.45)] sm:h-11 sm:w-11" />
        <span className="absolute h-12 w-12 -rotate-12 rounded-full border-l border-lime-300/60 border-r-transparent border-t-lime-300/70 border-b-transparent sm:h-16 sm:w-16" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xl text-black">●</span>
        <span className="absolute h-2.5 w-2.5 rounded-full bg-black sm:h-3 sm:w-3" />
      </div>
      <div className="truncate text-[1.05rem] font-black italic leading-none text-white sm:text-[1.35rem]">
        KORA<span className="text-lime-300">SMART</span>
      </div>
    </Link>
  );
}
