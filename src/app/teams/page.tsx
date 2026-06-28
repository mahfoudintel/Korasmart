import { PageHeading } from "@/components/page-heading";
import { Card, SectionTitle } from "@/components/ui/card";
import { fluorescentTeam, orangeTeam } from "@/lib/data";

export default function TeamsPage() {
  const teams = [
    { name: "Fluorescent Team", team: fluorescentTeam, tone: "lime" },
    { name: "Orange Team", team: orangeTeam, tone: "orange" }
  ] as const;

  return (
    <>
      <PageHeading title="Team Generator" subtitle="Smart balancing using skill, speed, stamina, historic performance, goals, wins, and attendance." />
      <div className="grid gap-5 lg:grid-cols-2">
        {teams.map(({ name, team, tone }) => (
          <Card key={name}>
            <SectionTitle>{name}</SectionTitle>
            <div className="mt-5 space-y-3">
              {team.map((player) => (
                <div key={player.name} className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div>
                    <p className="font-black">{player.name}</p>
                    <p className="text-sm text-white/60">{player.position}</p>
                  </div>
                  <span className={tone === "lime" ? "text-lime-300" : "text-orange-400"}>{player.rating}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/65">Chemistry score</p>
              <p className="text-3xl font-black text-lime-300">85%</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
