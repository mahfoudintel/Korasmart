import { Card } from "@/components/ui/card";
import { players } from "@/lib/data";

type Player = (typeof players)[number];

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/65">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-lime-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:border-lime-300/40">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-lime-300 bg-gradient-to-br from-white to-zinc-500 text-2xl font-black text-black">
          {player.name[0]}
        </div>
        <div>
          <h3 className="text-xl font-black">{player.name}</h3>
          <p className="text-sm text-white/65">{player.position}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-white/55">Skill</p>
          <p className="text-2xl font-black text-lime-300">{player.skill}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <Meter label="Technique" value={player.skill} />
        <Meter label="Speed" value={player.speed} />
        <Meter label="Stamina" value={player.stamina} />
        <Meter label="Passing" value={player.passing} />
        <Meter label="Defense" value={player.defense} />
        <Meter label="Shooting" value={player.shooting} />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl bg-white/5 p-3 text-center text-sm">
        <span><b className="block text-lg text-white">{player.goals}</b>Goals</span>
        <span><b className="block text-lg text-white">{player.assists}</b>Assists</span>
        <span><b className="block text-lg text-white">{player.wins}</b>Wins</span>
        <span><b className="block text-lg text-white">{player.mvps}</b>MVPs</span>
      </div>
    </Card>
  );
}
