"use client";

import { ShieldCheck } from "lucide-react";
import { canManageRoles, getRoleForPlayer, roleLabels } from "@/lib/access";
import { useRole } from "@/hooks/use-role";
import { Card, SectionTitle } from "@/components/ui/card";
import { players } from "@/lib/data";

export function AccessSettings() {
  const { role } = useRole();
  const canManageAccess = canManageRoles(role);
  const assignments = players.map((player) => ({ player: player.name, role: getRoleForPlayer(player.name) }));

  if (!canManageAccess) {
    return (
      <Card>
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-orange-600" />
          <div>
            <SectionTitle>Access Control</SectionTitle>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Admin access is required to manage roles and permissions.
            </p>
            <p className="mt-3 rounded-2xl bg-white/55 p-3 text-sm font-extrabold text-slate-700">
              Your current access: {roleLabels[role]}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionTitle>Access Control</SectionTitle>
          <p className="mt-3 text-sm text-slate-600">
            Najib and Nawfal have Admin access. Every other player has Player access.
          </p>
        </div>
        <ShieldCheck className="h-8 w-8 text-[#2f9e2f]" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {assignments.map((assignment) => (
          <div key={assignment.player} className="rounded-2xl border border-white/60 bg-white/55 p-4">
            <p className="font-extrabold text-slate-900">{assignment.player}</p>
            <p className={assignment.role === "admin" ? "mt-2 rounded-full bg-lime-100 px-3 py-1 text-sm font-extrabold text-[#247e24]" : "mt-2 rounded-full bg-white/70 px-3 py-1 text-sm font-extrabold text-slate-600"}>
              {roleLabels[assignment.role]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/60 bg-white/55 p-4 text-sm text-slate-600">
        Current access is derived from the signed-in local profile.
        <span className="mt-2 block font-extrabold text-[#247e24]">Detected access: {roleLabels[role]}</span>
      </div>
    </Card>

    <Card>
      <SectionTitle>Permission Matrix</SectionTitle>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/60 bg-white/45">
        {[
          ["View Home, Matches, Players, Finances, Insights", "Admin + Player"],
          ["Confirm attendance / join waiting list", "Admin + Player"],
          ["Add, edit, cancel, or delete bookings", "Admin"],
          ["Update contributions and caisse", "Admin"],
          ["Add or remove players", "Admin"],
          ["Open Admin settings", "Admin"]
        ].map(([permission, allowed]) => (
          <div key={permission} className="grid gap-3 border-b border-white/55 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_180px]">
            <span className="font-semibold text-slate-700">{permission}</span>
            <span className="font-extrabold text-slate-950">{allowed}</span>
          </div>
        ))}
      </div>
    </Card>
    </div>
  );
}
