export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="sr-only">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
