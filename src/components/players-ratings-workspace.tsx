"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Lock, Plus, RotateCcw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { calculateQuantitativeScore, emptyRatingValues, normalizeRatingValues, ratingIndicators, ratingsStorageKey, type PeerRatings, type RatingValues } from "@/lib/ratings";
import { useMembers } from "@/hooks/use-members";
import { useRole } from "@/hooks/use-role";
import { canManageMembers, canManageRoles } from "@/lib/access";
import { useLanguage } from "@/components/language-provider";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

const anonymousRaterKey = "korasmart-anonymous-rater-id";
const clampRating = (value: number) => Math.min(Math.max(value, 0), 10);
const formatRating = (value: number) => Number((Math.round(value * 2) / 2).toFixed(1));

export function PlayersRatingsWorkspace() {
  const { members, defaultCount, addedCount, removedCount, addMember, removeMember } = useMembers();
  const { role } = useRole();
  const { language } = useLanguage();
  const canEditMembers = canManageMembers(role);
  const canResetRatings = canManageRoles(role);
  const t = (text: string) => translateText(text, language);
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

  const currentRaterRatings = ratings[anonymousRaterId] || {};
  const currentRaterSubmissions = Object.keys(currentRaterRatings).length;
  const existingRating = ratings[anonymousRaterId]?.[target];
  const selectedPlayerScore = playerScores.find((item) => item.player === target);
  const completionTarget = members.length;
  const completionPercent = completionTarget ? Math.round((currentRaterSubmissions / completionTarget) * 100) : 0;
  const unratedPlayers = members.filter((member) => !currentRaterRatings[member.name]);
  const selectedIndex = members.findIndex((member) => member.name === target);
  const isComplete = currentRaterSubmissions >= completionTarget && completionTarget > 0;

  useEffect(() => {
    setDraft(normalizeRatingValues(existingRating));
  }, [existingRating, target]);

  const saveRating = () => {
    if (!target || existingRating) return;

    setRatings((current) => ({
      ...current,
      [anonymousRaterId]: {
        ...(current[anonymousRaterId] || {}),
        [target]: draft
      }
    }));

    const nextUnrated = members.find((member) => member.name !== target && !currentRaterRatings[member.name]);
    if (nextUnrated) setTarget(nextUnrated.name);
  };

  const handleAddMember = async () => {
    if (!canEditMembers) return;
    const result = await addMember(memberName);
    setMemberMessage(result.message);
    if (result.ok) setMemberName("");
  };

  const updateDraftRating = (key: keyof RatingValues, value: number) => {
    if (existingRating) return;
    setDraft((current) => ({ ...current, [key]: formatRating(clampRating(value)) }));
  };

  const resetRatingsForPlayer = (playerName: string) => {
    if (!canResetRatings) return;

    setRatings((current) =>
      Object.fromEntries(
        Object.entries(current).map(([raterId, playerRatings]) => {
          const nextPlayerRatings = { ...playerRatings };
          delete nextPlayerRatings[playerName];
          return [raterId, nextPlayerRatings];
        })
      )
    );
  };

  const moveTarget = (direction: -1 | 1) => {
    if (!members.length) return;
    const nextIndex = selectedIndex < 0 ? 0 : (selectedIndex + direction + members.length) % members.length;
    setTarget(members[nextIndex].name);
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
              Admin or Superuser access is required to add or remove players.
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <SectionTitle>{t("Player Ratings")}</SectionTitle>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                {t("Rate each player once. Only anonymous averages feed team balancing.")}
              </p>
            </div>
            <div className="w-full rounded-2xl border border-white/60 bg-white/58 p-4 lg:w-72">
              <div className="flex items-center justify-between gap-3 text-sm font-black text-slate-700">
                <span>{t("Your progress")}</span>
                <span className="text-[#247e24]">{currentRaterSubmissions}/{completionTarget}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-[#35b43a]" style={{ width: `${completionPercent}%` }} />
              </div>
              <p className="mt-2 text-xs font-bold text-slate-500">{completionPercent}% {t("completed")}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[20px] border border-lime-200 bg-lime-50/80 p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#247e24]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-slate-950">{t("Anonymous and one-time")}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {t("Nobody sees who gave which rating. Superuser can only reset a player when needed.")}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-[.12em] text-[#247e24]">{t("Quick rating: about 30 seconds")}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[290px_1fr]">
            <div className="rounded-[20px] border border-white/60 bg-white/46 p-3">
              <div className="flex items-center justify-between gap-2 px-1">
                <p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Players to rate")}</p>
                {isComplete && <CheckCircle2 className="h-5 w-5 text-[#247e24]" />}
              </div>
              <div className="mt-3 grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                {members.map((member) => {
                  const done = Boolean(currentRaterRatings[member.name]);
                  return (
                    <button
                      key={member.name}
                      onClick={() => setTarget(member.name)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition",
                        target === member.name
                          ? "border-lime-300 bg-lime-50 text-slate-950"
                          : "border-white/60 bg-white/56 text-slate-700 hover:bg-white/72"
                      )}
                    >
                      <span className="min-w-0 truncate font-black">{member.name}</span>
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#247e24]" />
                      ) : (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="rounded-[20px] border border-white/60 bg-white/56 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Now rating")}</p>
                    <h3 className="mt-1 truncate text-3xl font-black tracking-normal text-slate-950">{target}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => moveTarget(-1)} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/70 text-slate-700">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => moveTarget(1)} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/70 text-slate-700">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {canResetRatings && target && (
                      <button
                        onClick={() => resetRatingsForPlayer(target)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 text-sm font-black text-orange-700 transition hover:bg-orange-100"
                      >
                        <RotateCcw className="h-4 w-4" />
                        {t("Reset")}
                      </button>
                    )}
                  </div>
                </div>

                {existingRating && (
                  <p className="mt-4 flex gap-3 rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm font-semibold text-slate-700">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#247e24]" />
                    <span><span>{t("Rating locked for")}</span> <span className="font-black text-[#247e24]">{target}</span>. <span>{t("A Superuser can reset this player to allow a new rating.")}</span></span>
                  </p>
                )}

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {ratingIndicators.map((indicator) => (
                    <label key={indicator.key} className="rounded-2xl border border-white/65 bg-white/58 p-4">
                      <div className="mb-3 flex justify-between gap-3 text-sm font-black text-slate-800">
                        <span>{t(indicator.label)}</span>
                        <span className="text-[#247e24]">{Number((draft[indicator.key] ?? 0).toFixed(1))}/10</span>
                      </div>
                      <p className="mb-3 min-h-10 text-xs font-semibold leading-5 text-slate-500">{t(indicator.helper)}</p>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={draft[indicator.key]}
                        onChange={(event) => updateDraftRating(indicator.key, Number(event.target.value))}
                        disabled={Boolean(existingRating)}
                        className="w-full accent-[#35b43a]"
                      />
                      <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-black uppercase tracking-[.06em] text-slate-400">
                        <span>1-3</span>
                        <span>4-6</span>
                        <span>7-8</span>
                        <span>9-10</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/58 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-600">
                    {existingRating ? (
                      <>
                        <span>{t("Rating saved")}</span>
                        <span className="mx-2 font-black text-[#247e24]">{selectedPlayerScore?.score ?? "-"}/10</span>
                        <span>{selectedPlayerScore?.submissions ?? 0} {t("votes")}</span>
                      </>
                    ) : (
                      t("No rating saved yet for this player.")
                    )}
                  </p>
                  <button
                    onClick={saveRating}
                    disabled={Boolean(existingRating)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white shadow-[0_16px_30px_rgba(47,158,47,.22)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                  >
                    <Save className="h-4 w-4" />
                    {existingRating ? t("Rating saved") : t("Save rating")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle>{t("Rating Summary")}</SectionTitle>
            <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-slate-500">
              {unratedPlayers.length} {t("left")}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {playerScores.map((item) => (
              <div key={item.player} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/56 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-black">{item.player[0]}</span>
                <span className="flex-1 font-black text-slate-950">{item.player}</span>
                <span className="text-sm font-bold text-slate-500">{item.submissions} {t("votes")}</span>
                <span className="min-w-14 text-right text-2xl font-black text-[#247e24]">{item.score ?? "-"}</span>
                {canResetRatings && (
                  <button
                    onClick={() => resetRatingsForPlayer(item.player)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-700 transition hover:bg-orange-100"
                    title={`Reset ratings for ${item.player}`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
