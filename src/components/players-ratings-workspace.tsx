"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { calculateQuantitativeScore, emptyRatingValues, ratingIndicators, type RatingValues } from "@/lib/ratings";
import { useMembers } from "@/hooks/use-members";
import { useRole } from "@/hooks/use-role";
import { canManageMembers } from "@/lib/access";

type PeerRatings = Record<string, Record<string, RatingValues>>;
const ratingsStorageKey = "korasmart-peer-ratings-v1";
const anonymousRaterKey = "korasmart-anonymous-rater-id";

export function PlayersRatingsWorkspace() {
  const { members, defaultCount, addedCount, removedCount, addMember, removeMember } = useMembers();
  const { role } = useRole();
  const canEditMembers = canManageMembers(role);
  const [memberName, setMemberName] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [anonymousRaterId, setAnonymousRaterId] = useState("anonymous-session");
  const [target, setTarget] = useState(members[0]?.name || "");
  const [draft, setDraft] = useState<RatingValues>(emptyRatingValues);
  const [ratings, setRatings] = useState<PeerRatings>({});
  useEffect(() => {
    if (!members.length) return;

    if (!target || !members.some((member) => member.name === target)) {
      setTarget(members[0].name);
    }
  }, [members, target]);

  useEffect(() => {
    const savedAnonymousId = window.localStorage.getItem(anonymousRaterKey);
    if (savedAnonymousId) {
      setAnonymousRaterId(savedAnonymousId);
    } else {
      const newAnonymousId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `anonymous-${crypto.randomUUID()}`
          : `anonymous-${Date.now()}`;
      window.localStorage.setItem(anonymousRaterKey, newAnonymousId);
      setAnonymousRaterId(newAnonymousId);
    }

    const savedRatings = window.localStorage.getItem(ratingsStorageKey);

    if (savedRatings) setRatings(JSON.parse(savedRatings) as PeerRatings);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ratingsStorageKey, JSON.stringify(ratings));
  }, [ratings]);

  const playerScores = useMemo(
    () =>
      members.map((player) => {
        const receivedRatings = Object.values(ratings)
          .map((raterRatings) => raterRatings[player.name])
          .filter(Boolean);
        const quantitativeScore = calculateQuantitativeScore(receivedRatings);

        return {
          player: player.name,
          score: quantitativeScore,
          submissions: receivedRatings.length
        };
      }),
    [members, ratings]
  );

  const currentRaterSubmissions = Object.keys(ratings[anonymousRaterId] || {}).length;
  const existingRating = ratings[anonymousRaterId]?.[target];

  const saveRating = () => {
    if (!target) return;

    setRatings((current) => ({
      ...current,
      [anonymousRaterId]: {
        ...(current[anonymousRaterId] || {}),
        [target]: draft
      }
    }));
  };

  const handleAddMember = () => {
    if (!canEditMembers) return;
    const result = addMember(memberName);
    setMemberMessage(result.message);
    if (result.ok) setMemberName("");
  };

  return (
    <>
      <Card className="mb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SectionTitle>Player Roster</SectionTitle>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              The active player list feeds attendance, team generation, and ratings.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-slate-600">
              <span className="rounded-full bg-white/65 px-3 py-1">{members.length} active</span>
              <span className="rounded-full bg-white/65 px-3 py-1">{defaultCount} default</span>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-[#247e24]">{addedCount} added</span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">{removedCount} removed</span>
            </div>
          </div>

          {canEditMembers ? <div className="w-full max-w-md">
            <div className="flex gap-2">
              <input
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleAddMember()}
                placeholder="Player name"
                className="h-11 min-w-0 flex-1 rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button onClick={handleAddMember} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#3dad3d] px-4 text-sm font-extrabold text-white">
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {memberMessage && <p className="mt-2 text-xs font-semibold text-slate-500">{memberMessage}</p>}
          </div> : (
            <p className="rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-600">
              Admin access is required to add or remove players.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div key={member.name} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/58 p-3">
              <div className="min-w-0">
                <p className="truncate font-extrabold text-slate-900">{member.name}</p>
                <p className="text-xs font-medium text-slate-500">Player</p>
              </div>
              {canEditMembers && (
                <button
                  onClick={() => removeMember(member.name)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-700 transition hover:bg-orange-100"
                  title={`Remove ${member.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionTitle>Player Ratings</SectionTitle>
              <p className="mt-2 text-sm text-white/65">Anonymous 1-5 ratings help balance teams.</p>
            </div>
            <div className="rounded-2xl bg-lime-300/10 px-4 py-3 text-sm font-black text-lime-300">
              {currentRaterSubmissions}/{Math.max(members.length - 1, 0)} completed
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
              <p className="text-xs font-black uppercase text-lime-300">Anonymous rating</p>
              <p className="mt-2 text-sm text-white/70">Pick a player, rate key skills, then save.</p>
            </div>
            <label className="text-sm font-bold text-white/70">
              Player to rate
              <select value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none">
                {members.map((player) => <option key={player.name}>{player.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {ratingIndicators.map((indicator) => (
              <label key={indicator.key} className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <div className="mb-3 flex justify-between text-sm font-black">
                  <span>{indicator.label}</span>
                  <span className="text-lime-300">{draft[indicator.key]}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={draft[indicator.key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [indicator.key]: Number(event.target.value) }))}
                  className="w-full accent-lime-300"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/65">
              {existingRating ? "This anonymous session already rated this player. Saving will update the same entry." : "No anonymous rating saved yet for this player."}
            </p>
            <button onClick={saveRating} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black">
              <Save className="h-4 w-4" />
              Save rating
            </button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Rating Summary</SectionTitle>
          <div className="mt-5 space-y-3">
            {playerScores.map((item) => (
              <div key={item.player} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-black">{item.player[0]}</span>
                <span className="flex-1 font-black">{item.player}</span>
                <span className="text-sm text-white/55">{item.submissions} votes</span>
                <span className="min-w-14 text-right text-2xl font-black text-lime-300">{item.score ?? "-"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
