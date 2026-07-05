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
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/78 text-slate-800 shadow-[0_10px_24px_rgba(38,59,28,.1)] backdrop-blur-xl sm:h-11 sm:w-11"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? <BellRing className="h-5 w-5 text-[#2f9e2f]" /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime-300 px-1 text-xs font-black text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-panel absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-[20px] p-3">
          <div className="flex items-center justify-between gap-3 px-2 pb-3">
            <div>
              <p className="text-sm font-black text-slate-950">Notifications</p>
              <p className="text-xs text-slate-500">
                {notifications.length ? "Live from schedule and attendance." : "Nothing new right now."}
              </p>
            </div>
            <button onClick={markAllRead} className="grid h-9 w-9 place-items-center rounded-full border border-white/60 text-[#2f9e2f]" title="Mark all read">
              <CheckCheck className="h-4 w-4" />
            </button>
          </div>

          {permission !== "granted" && typeof window !== "undefined" && "Notification" in window && (
            <button
              onClick={requestPermission}
              className="mb-3 w-full rounded-2xl border border-lime-300/40 bg-lime-100 px-4 py-3 text-left text-xs font-bold text-[#247e24]"
            >
              Enable browser notifications on this device
            </button>
          )}

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link key={notification.id} href={notification.href} onClick={() => setOpen(false)} className="block rounded-2xl border border-white/60 bg-white/55 p-3 transition hover:border-lime-400">
                  <p className="text-sm font-black text-slate-950">{notification.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{notification.body}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-white/60 bg-white/55 p-4 text-sm text-slate-500">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
