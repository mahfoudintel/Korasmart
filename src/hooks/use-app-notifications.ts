"use client";

import { useEffect, useMemo, useState } from "react";
import { useAttendance } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { getSessionReservationStatus } from "@/lib/workflow-rules";
import { useLanguage } from "@/components/language-provider";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
};

const readStorageKey = "korasmart-read-notifications-v1";
const deliveredStorageKey = "korasmart-delivered-notifications-v1";

function notificationCopy(language: "en" | "fr" | "ar") {
  return {
    nextTitle: language === "fr" ? "Prochain match planifie" : language === "ar" ? "تمت جدولة المباراة القادمة" : "Next game scheduled",
    openTitle: language === "fr" ? "Reservation ouverte" : language === "ar" ? "الحجز مفتوح" : "Reservation is open",
    openBody: language === "fr" ? "Confirme ta presence." : language === "ar" ? "أكد حضورك." : "Confirm your attendance.",
    confirmedTitle: language === "fr" ? "Presence confirmee" : language === "ar" ? "تم تأكيد حضورك" : "You are confirmed",
    waitingTitle: language === "fr" ? "Liste d'attente" : language === "ar" ? "قائمة الانتظار" : "You are on the waiting list",
    scheduleBody: (date: string, time: string, venue: string) =>
      language === "fr"
        ? `${date} a ${time} - ${venue}`
        : language === "ar"
          ? `${date} على الساعة ${time} - ${venue}`
          : `${date} at ${time} - ${venue}`,
    confirmedBody: (player: string, position: number) =>
      language === "fr"
        ? `${player} est confirme en place #${position}.`
        : language === "ar"
          ? `${player} مؤكد في المركز #${position}.`
          : `${player} is confirmed in spot #${position}.`,
    waitingBody: (player: string, position: number) =>
      language === "fr"
        ? `${player} est en attente en position #${position}.`
        : language === "ar"
          ? `${player} في قائمة الانتظار بالمركز #${position}.`
          : `${player} is waiting in position #${position}.`
  };
}

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
  const { language } = useLanguage();
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
    const copy = notificationCopy(language);

    const items: AppNotification[] = [
      {
        id: `reservation-${nextReservation.id}`,
        title: copy.nextTitle,
        body: copy.scheduleBody(formatReservationDate(nextReservation.date), nextReservation.time, nextReservation.venue),
        href: "/"
      }
    ];
    const reservationStatus = getSessionReservationStatus(nextReservation);

    if (!attendance.currentStatus && reservationStatus === "open") {
      items.push({
        id: `reservation-open-${nextReservation.id}`,
        title: copy.openTitle,
        body: copy.openBody,
        href: "/"
      });
    }

    if (attendance.currentStatus === "playing") {
      items.push({
        id: `attendance-confirmed-${nextReservation.id}-${attendance.selectedPlayer}`,
        title: copy.confirmedTitle,
        body: copy.confirmedBody(attendance.selectedPlayer, attendance.selectedPosition),
        href: "/"
      });
    }

    if (attendance.currentStatus === "waiting") {
      items.push({
        id: `attendance-waiting-${nextReservation.id}-${attendance.selectedPlayer}`,
        title: copy.waitingTitle,
        body: copy.waitingBody(attendance.selectedPlayer, attendance.selectedPosition),
        href: "/"
      });
    }

    return items;
  }, [attendance.currentStatus, attendance.selectedPlayer, attendance.selectedPosition, language, nextReservation]);

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
