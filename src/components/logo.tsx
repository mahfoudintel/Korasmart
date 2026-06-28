export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center">
        <span className="absolute h-11 w-11 rounded-full border-2 border-lime-300 shadow-[0_0_22px_rgba(200,255,26,.45)]" />
        <span className="absolute h-16 w-16 -rotate-12 rounded-full border-l border-lime-300/60 border-r-transparent border-t-lime-300/70 border-b-transparent" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xl text-black">●</span>
        <span className="absolute h-3 w-3 rounded-full bg-black" />
      </div>
      <div className="text-[1.35rem] font-black italic leading-none text-white">
        KORA<span className="text-lime-300">SMART</span>
      </div>
    </div>
  );
}
