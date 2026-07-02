export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 rounded-[20px] border border-white/45 bg-white/28 px-5 py-4 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl font-medium text-slate-700">{subtitle}</p>
    </div>
  );
}
