"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useMembers } from "@/hooks/use-members";
import { supabase } from "@/lib/supabase";
import { formatReservationOpenMessage, getSessionReservationStatus } from "@/lib/workflow-rules";
import { type Reservation } from "@/lib/reservations";

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

export function useAttendance(reservationId?: string, reservation?: Reservation) {
  const { session } = useAuth();
  const { profile } = useLocalProfile();
  const { members } = useMembers();
  const [selectedPlayer, setSelectedPlayer] = useState(members[0]?.name || "");
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [saveError, setSaveError] = useState("");
  const remoteEnabled = Boolean(supabase && session);

  useEffect(() => {
    if (profile.loggedIn) setSelectedPlayer(profile.playerName);
  }, [profile.loggedIn, profile.playerName]);

  useEffect(() => {
    if (!members.length) return;
    if (!selectedPlayer || !members.some((member) => member.name === selectedPlayer)) {
      setSelectedPlayer(members[0].name);
    }
  }, [members, selectedPlayer]);

  useEffect(() => {
    if (remoteEnabled) return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setAttendance(normalizeAttendance(JSON.parse(saved)));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [remoteEnabled]);

  useEffect(() => {
    let cancelled = false;
    const client = supabase;

    async function loadRemoteAttendance() {
      if (!client || !session) return;

      const { data, error } = await client
        .from("attendance")
        .select("status, joined_at, bookings(external_id), players(name)")
        .in("status", ["playing", "waiting"]);

      if (cancelled || error || !data) return;

      const nextAttendance: AttendanceMap = {};
      data.forEach((record) => {
        const booking = Array.isArray(record.bookings) ? record.bookings[0] : record.bookings;
        const player = Array.isArray(record.players) ? record.players[0] : record.players;
        const bookingId = booking?.external_id;
        const playerName = player?.name;
        if (!bookingId || !playerName || (record.status !== "playing" && record.status !== "waiting")) return;

        nextAttendance[bookingId] = {
          ...(nextAttendance[bookingId] || {}),
          [playerName]: {
            status: record.status,
            joinedAt: record.joined_at || new Date().toISOString()
          }
        };
      });

      setAttendance(nextAttendance);
    }

    loadRemoteAttendance();

    const channel = client
      ?.channel(`korasmart-attendance-sync-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, () => {
        void loadRemoteAttendance();
      })
      .subscribe();

    return () => {
      cancelled = true;
      if (channel) void client?.removeChannel(channel);
    };
  }, [session]);

  useEffect(() => {
    if (remoteEnabled) return;
    window.localStorage.setItem(storageKey, JSON.stringify(attendance));
  }, [attendance, remoteEnabled]);

  const reservationAttendance = useMemo(
    () => (reservationId ? attendance[reservationId] || {} : {}),
    [attendance, reservationId]
  );

  const summary = useMemo(() => {
    const values = Object.values(reservationAttendance);

    return {
      playing: values.filter((value) => value.status === "playing").length,
      waiting: values.filter((value) => value.status === "waiting").length,
      notAttending: Math.max(members.length - values.filter((value) => value.status === "playing" || value.status === "waiting").length, 0)
    };
  }, [members.length, reservationAttendance]);

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
  const reservationStatus = reservation ? getSessionReservationStatus(reservation) : reservationId ? "open" : "closed";
  const canSubmitAttendance = Boolean(reservationId && reservationStatus === "open");
  const attendanceMessage =
    reservation && reservationStatus === "closed"
      ? formatReservationOpenMessage(reservation)
      : reservationStatus === "completed"
        ? "This session is completed."
        : "";
  const selectedPosition =
    currentStatus === "playing"
      ? confirmedPlayers.findIndex((record) => record.player === selectedPlayer) + 1
      : currentStatus === "waiting"
        ? waitingPlayers.findIndex((record) => record.player === selectedPlayer) + 1
        : 0;

  const setStatus = async () => {
    if (!reservationId || !canSubmitAttendance) return;
    let nextStatus: AttendanceStatus = "playing";
    setSaveError("");

    setAttendance((current) => {
      const reservationRecords = current[reservationId] || {};
      const selectedCurrentStatus = reservationRecords[selectedPlayer]?.status;
      const requestedStatus =
        selectedCurrentStatus !== "playing" &&
        Object.values(reservationRecords).filter((record) => record.status === "playing").length >= playingLimit
          ? "waiting"
          : "playing";
      nextStatus = requestedStatus;

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

    if (supabase && session) {
      const { error } = await supabase.rpc("korasmart_save_attendance", {
        p_booking_external_id: reservationId,
        p_player_name: selectedPlayer,
        p_status: nextStatus
      });

      if (error) {
        setSaveError(error.message || "Attendance could not be saved.");
        setAttendance((current) => {
          const reservationRecords = { ...(current[reservationId] || {}) };
          delete reservationRecords[selectedPlayer];

          return {
            ...current,
            [reservationId]: promoteWaitingList(reservationRecords)
          };
        });
      }
    }
  };

  const dropOut = async () => {
    if (!reservationId || !canSubmitAttendance) return;
    setSaveError("");

    setAttendance((current) => {
      const reservationRecords = { ...(current[reservationId] || {}) };
      delete reservationRecords[selectedPlayer];

      return {
        ...current,
        [reservationId]: promoteWaitingList(reservationRecords)
      };
    });

    if (supabase && session) {
      const { error } = await supabase.rpc("korasmart_delete_attendance", {
        p_booking_external_id: reservationId,
        p_player_name: selectedPlayer
      });

      if (error) {
        setSaveError(error.message || "Attendance could not be saved.");
      }
    }
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    members,
    currentStatus,
    selectedPosition,
    summary,
    confirmedPlayers,
    waitingPlayers,
    playingLimit,
    reservationStatus,
    canSubmitAttendance,
    attendanceMessage,
    saveError,
    setStatus,
    dropOut
  };
}
