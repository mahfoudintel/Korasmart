import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";
import { players } from "@/lib/data";

export default function RankingsPage() {
  const ranked = [...players].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <PageHeading title="Rankings" subtitle="Simple ranking cards for rating, goals, assists, wins, MVPs, and evolving form." />
      <div className="grid gap-4">
        {ranked.map((player, index) => (
          <Card key={player.name} className="flex items-center gap-5">
            <span className="text-2xl font-black text-lime-300">{index + 1}</span>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl font-black text-black">{player.name[0]}</div>
            <div className="flex-1">
              <p className="font-black">{player.name}</p>
              <p className="text-sm text-white/60">{player.position}</p>
            </div>
            <span className="text-2xl font-black">{player.rating}</span>
          </Card>
        ))}
      </div>
    </>
  );
}
