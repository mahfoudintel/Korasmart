export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-white md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-white/70">{subtitle}</p>
    </div>
  );
}
