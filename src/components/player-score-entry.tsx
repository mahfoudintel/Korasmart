"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { players } from "@/lib/data";
import { Card, SectionTitle } from "@/components/ui/card";

type ScoreMap = Record<string, string>;

export function PlayerScoreEntry() {
  const [submittedBy, setSubmittedBy] = useState(players[0].name);
  const [scores, setScores] = useState<ScoreMap>(() =>
    Object.fromEntries(players.map((player) => [player.name, ""]))
  );

  const enteredScores = useMemo(
    () => Object.values(scores).map(Number).filter((score) => Number.isFinite(score) && score > 0),
    [scores]
  );
  const average = enteredScores.length
    ? (enteredScores.reduce((sum, score) => sum + score, 0) / enteredScores.length).toFixed(1)
    : "0.0";

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionTitle>Player Scores</SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-white/66">
            One player can submit scores for the full group after a match. These values are shaped to link back to player profiles later.
          </p>
        </div>
        <label className="min-w-56 text-sm font-bold text-white/72">
          Submitted by
          <select
            value={submittedBy}
            onChange={(event) => setSubmittedBy(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none"
          >
            {players.map((player) => (
              <option key={player.name} value={player.name} className="bg-[#08110b]">
                {player.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {players.map((player) => (
          <label key={player.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-black">
              {player.name.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-black">{player.name}</span>
              <span className="text-xs text-white/55">{player.position}</span>
            </span>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={scores[player.name]}
              onChange={(event) => {
                const value = event.target.value;
                setScores((current) => ({ ...current, [player.name]: value }));
              }}
              className="h-11 w-20 rounded-2xl border border-white/15 bg-black/15 text-center text-lg font-black text-lime-300 outline-none focus:border-lime-300"
              placeholder="-"
              aria-label={`Score for ${player.name}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-black text-lime-300">{enteredScores.length}/{players.length}</span> players scored
          <span className="mx-3 text-white/35">|</span>
          Average score <span className="font-black text-white">{average}</span>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black transition hover:bg-lime-200">
          <Save className="h-4 w-4" />
          Save score set
        </button>
      </div>
    </Card>
  );
}
