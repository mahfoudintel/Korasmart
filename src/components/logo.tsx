import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-lime-500">
      <div className="relative grid h-12 w-12 place-items-center [&_.text-xl]:text-transparent">
        <span className="absolute h-11 w-11 rounded-full border-2 border-lime-400 shadow-[0_0_18px_rgba(74,183,63,.25)]" />
        <span className="absolute h-16 w-16 -rotate-12 rounded-full border-l border-lime-500/55 border-r-transparent border-t-lime-400/70 border-b-transparent" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xl text-black">●</span>
        <span className="absolute h-3 w-3 rounded-full bg-slate-950" />
      </div>
      <div className="text-[1.35rem] font-black italic leading-none text-slate-950">
        KORA<span className="text-[#2f9e2f]">SMART</span>
      </div>
    </Link>
  );
}
