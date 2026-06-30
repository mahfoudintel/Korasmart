"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, BellRing, CheckCheck } from "lucide-react";
import { useAppNotifications } from "@/hooks/use-app-notifications";

export function AppNotifications() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, permission, markAllRead, requestPermission } = useAppNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen) markAllRead();
        }}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? <BellRing className="h-5 w-5 text-lime-300" /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime-300 px-1 text-xs font-black text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-[20px] border border-white/10 bg-[#10190f]/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-2 pb-3">
            <div>
              <p className="text-sm font-black text-white">Notifications</p>
              <p className="text-xs text-white/55">
                {notifications.length ? "Live from schedule and attendance." : "Nothing new right now."}
              </p>
            </div>
            <button onClick={markAllRead} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-lime-300" title="Mark all read">
              <CheckCheck className="h-4 w-4" />
            </button>
          </div>

          {permission !== "granted" && typeof window !== "undefined" && "Notification" in window && (
            <button
              onClick={requestPermission}
              className="mb-3 w-full rounded-2xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-left text-xs font-bold text-lime-200"
            >
              Enable browser notifications on this device
            </button>
          )}

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link key={notification.id} href={notification.href} onClick={() => setOpen(false)} className="block rounded-2xl border border-white/10 bg-white/[.06] p-3 transition hover:border-lime-300/35">
                  <p className="text-sm font-black text-white">{notification.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/62">{notification.body}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm text-white/60">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
