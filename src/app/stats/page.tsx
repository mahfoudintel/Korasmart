import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";
import { statHighlights } from "@/lib/data";

export default function StatsPage() {
  return (
    <>
      <PageHeading title="Stats" subtitle="Card-based insights for scorers, assists, wins, attendance, MVPs, streaks, chemistry, and monthly recaps." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statHighlights.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="min-h-44">
              <Icon className="h-8 w-8 text-lime-300" />
              <p className="mt-6 text-sm font-black uppercase text-white/60">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-black">{stat.value}</h2>
              <p className="text-orange-400">{stat.meta}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}
