"use client";

import { useEffect, useMemo, useState } from "react";
import { useAttendance } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { getSessionReservationStatus } from "@/lib/workflow-rules";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
};

const readStorageKey = "korasmart-read-notifications-v1";
const deliveredStorageKey = "korasmart-delivered-notifications-v1";

function readIdSet(key: string) {
  try {
    const saved = window.localStorage.getItem(key);
    return new Set(saved ? (JSON.parse(saved) as string[]) : []);
  } catch {
    window.localStorage.removeItem(key);
    return new Set<string>();
  }
}

export function useAppNotifications() {
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const attendance = useAttendance(nextReservation?.id, nextReservation);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setReadIds(readIdSet(readStorageKey));
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  const notifications = useMemo<AppNotification[]>(() => {
    if (!nextReservation) return [];

    const items: AppNotification[] = [
      {
        id: `reservation-${nextReservation.id}`,
        title: "Next game scheduled",
        body: `${formatReservationDate(nextReservation.date)} at ${nextReservation.time} - ${nextReservation.venue}`,
        href: "/"
      }
    ];
    const reservationStatus = getSessionReservationStatus(nextReservation);

    if (!attendance.currentStatus && reservationStatus === "open") {
      items.push({
        id: `reservation-open-${nextReservation.id}`,
        title: "Reservation is open",
        body: "Choose attending to reserve your place. No response means not attending.",
        href: "/"
      });
    }

    if (attendance.currentStatus === "playing") {
      items.push({
        id: `attendance-confirmed-${nextReservation.id}-${attendance.selectedPlayer}`,
        title: "You are confirmed",
        body: `${attendance.selectedPlayer} is confirmed in spot #${attendance.selectedPosition}.`,
        href: "/"
      });
    }

    if (attendance.currentStatus === "waiting") {
      items.push({
        id: `attendance-waiting-${nextReservation.id}-${attendance.selectedPlayer}`,
        title: "You are on the waiting list",
        body: `${attendance.selectedPlayer} is waiting in position #${attendance.selectedPosition}.`,
        href: "/"
      });
    }

    return items;
  }, [attendance.currentStatus, attendance.selectedPlayer, attendance.selectedPosition, nextReservation]);

  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const deliveredIds = readIdSet(deliveredStorageKey);
    const nextToDeliver = notifications.find((notification) => !deliveredIds.has(notification.id));
    if (!nextToDeliver) return;

    new Notification(nextToDeliver.title, {
      body: nextToDeliver.body,
      icon: "/favicon.ico"
    });

    deliveredIds.add(nextToDeliver.id);
    window.localStorage.setItem(deliveredStorageKey, JSON.stringify([...deliveredIds]));
  }, [notifications]);

  const unreadCount = notifications.filter((notification) => !readIds.has(notification.id)).length;

  const markAllRead = () => {
    const nextReadIds = new Set([...readIds, ...notifications.map((notification) => notification.id)]);
    setReadIds(nextReadIds);
    window.localStorage.setItem(readStorageKey, JSON.stringify([...nextReadIds]));
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
  };

  return {
    notifications,
    unreadCount,
    permission,
    markAllRead,
    requestPermission
  };
}
