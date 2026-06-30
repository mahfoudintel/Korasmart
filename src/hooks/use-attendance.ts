"use client";

import { useEffect, useMemo, useState } from "react";
import { players } from "@/lib/data";
import { useLocalProfile } from "@/hooks/use-local-profile";

export type AttendanceStatus = "playing" | "waiting";

export type AttendanceRecord = {
  status: AttendanceStatus;
  joinedAt: string;
};

export type AttendanceMap = Record<string, Record<string, AttendanceRecord>>;

const storageKey = "korasmart-attendance-v1";
export const playingLimit = 10;

function normalizeAttendance(saved: unknown): AttendanceMap {
  if (!saved || typeof saved !== "object") return {};

  return Object.fromEntries(
    Object.entries(saved as Record<string, Record<string, AttendanceStatus | AttendanceRecord | "maybe" | "out">>).map(
      ([reservationId, reservationAttendance]) => {
        const normalizedRecords = Object.entries(reservationAttendance || {}).flatMap(([player, value], index) => {
          const status = typeof value === "string" ? value : value.status;
          if (status !== "playing" && status !== "waiting") return [];

          return [
            [
              player,
              {
                status,
                joinedAt: typeof value === "string" ? new Date(Date.now() + index).toISOString() : value.joinedAt || new Date(Date.now() + index).toISOString()
              }
            ] as const
          ];
        });

        return [reservationId, Object.fromEntries(normalizedRecords)];
      }
    )
  );
}

function promoteWaitingList(reservationAttendance: Record<string, AttendanceRecord>) {
  const playingCount = Object.values(reservationAttendance).filter((record) => record.status === "playing").length;
  const openSpots = playingLimit - playingCount;

  if (openSpots <= 0) return reservationAttendance;

  const waitingPlayers = Object.entries(reservationAttendance)
    .filter(([, record]) => record.status === "waiting")
    .sort((a, b) => new Date(a[1].joinedAt).getTime() - new Date(b[1].joinedAt).getTime())
    .slice(0, openSpots);

  return waitingPlayers.reduce<Record<string, AttendanceRecord>>(
    (nextAttendance, [player]) => ({
      ...nextAttendance,
      [player]: {
        ...nextAttendance[player],
        status: "playing"
      }
    }),
    reservationAttendance
  );
}

export function useAttendance(reservationId?: string) {
  const { profile } = useLocalProfile();
  const [selectedPlayer, setSelectedPlayer] = useState(players[0].name);
  const [attendance, setAttendance] = useState<AttendanceMap>({});

  useEffect(() => {
    if (profile.loggedIn) setSelectedPlayer(profile.playerName);
  }, [profile.loggedIn, profile.playerName]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setAttendance(normalizeAttendance(JSON.parse(saved)));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(attendance));
  }, [attendance]);

  const reservationAttendance = reservationId ? attendance[reservationId] || {} : {};

  const summary = useMemo(() => {
    const values = Object.values(reservationAttendance);

    return {
      playing: values.filter((value) => value.status === "playing").length,
      waiting: values.filter((value) => value.status === "waiting").length,
      notAttending: Math.max(players.length - values.filter((value) => value.status === "playing" || value.status === "waiting").length, 0)
    };
  }, [reservationAttendance]);

  const orderedAttendance = useMemo(
    () =>
      Object.entries(reservationAttendance)
        .map(([player, record]) => ({ player, ...record }))
        .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()),
    [reservationAttendance]
  );

  const confirmedPlayers = orderedAttendance.filter((record) => record.status === "playing");
  const waitingPlayers = orderedAttendance.filter((record) => record.status === "waiting");
  const selectedRecord = reservationId ? reservationAttendance[selectedPlayer] : undefined;
  const currentStatus = selectedRecord?.status;
  const selectedPosition =
    currentStatus === "playing"
      ? confirmedPlayers.findIndex((record) => record.player === selectedPlayer) + 1
      : currentStatus === "waiting"
        ? waitingPlayers.findIndex((record) => record.player === selectedPlayer) + 1
        : 0;

  const setStatus = () => {
    if (!reservationId) return;

    setAttendance((current) => {
      const reservationRecords = current[reservationId] || {};
      const selectedCurrentStatus = reservationRecords[selectedPlayer]?.status;
      const requestedStatus =
        selectedCurrentStatus !== "playing" &&
        Object.values(reservationRecords).filter((record) => record.status === "playing").length >= playingLimit
          ? "waiting"
          : "playing";

      const nextReservationAttendance = promoteWaitingList({
        ...reservationRecords,
        [selectedPlayer]: {
          status: requestedStatus,
          joinedAt:
            requestedStatus === "playing" || requestedStatus === "waiting"
              ? reservationRecords[selectedPlayer]?.joinedAt || new Date().toISOString()
              : new Date().toISOString()
        }
      });

      return {
        ...current,
        [reservationId]: nextReservationAttendance
      };
    });
  };

  const dropOut = () => {
    if (!reservationId) return;

    setAttendance((current) => {
      const reservationRecords = { ...(current[reservationId] || {}) };
      delete reservationRecords[selectedPlayer];

      return {
        ...current,
        [reservationId]: promoteWaitingList(reservationRecords)
      };
    });
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    currentStatus,
    selectedPosition,
    summary,
    confirmedPlayers,
    waitingPlayers,
    playingLimit,
    setStatus,
    dropOut
  };
}
