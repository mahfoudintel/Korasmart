"use client";

import { useState } from "react";
import { RotateCcw, ShieldCheck } from "lucide-react";
import {
  canManageRoles,
  getRoleForPlayer,
  resetAccessAssignments,
  roleLabels,
  setRoleForPlayer,
  type UserRole
} from "@/lib/access";
import { useRole } from "@/hooks/use-role";
import { Card, SectionTitle } from "@/components/ui/card";
import { players } from "@/lib/data";

const editableRoles: UserRole[] = ["player", "budgeting_booking_officer", "admin", "superuser"];

const roleDescriptions: Record<UserRole, string> = {
  superuser: "Full access, role changes, and impersonation.",
  admin: "Bookings, finances, and player management.",
  budgeting_booking_officer: "Bookings and contribution updates.",
  player: "Player view, attendance, and personal status."
};

const readAssignments = () => players.map((player) => ({ player: player.name, role: getRoleForPlayer(player.name) }));

export function AccessSettings() {
  const { role } = useRole();
  const [assignments, setAssignments] = useState(readAssignments);
  const canManageAccess = canManageRoles(role);

  const updatePlayerRole = (playerName: string, nextRole: UserRole) => {
    setRoleForPlayer(playerName, nextRole);
    setAssignments(readAssignments());
  };

  const resetRoles = () => {
    resetAccessAssignments();
    setAssignments(readAssignments());
  };

  if (!canManageAccess) {
    return (
      <Card>
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-orange-600" />
          <div>
            <SectionTitle>Access Control</SectionTitle>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Superuser access is required to manage roles and impersonation.
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionTitle>Access Control</SectionTitle>
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Najib is Superuser by default. Nawfal is Admin by default.
          </p>
        </div>
        <button
          onClick={resetRoles}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 text-sm font-black text-slate-800 transition hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset defaults
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/60 bg-white/45">
        {assignments.map((assignment) => (
          <div
            key={assignment.player}
            className="grid gap-3 border-b border-white/55 p-4 last:border-b-0 md:grid-cols-[1fr_260px_1.2fr] md:items-center"
          >
            <div>
              <p className="font-extrabold text-slate-950">{assignment.player}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{roleDescriptions[assignment.role]}</p>
            </div>
            <select
              value={assignment.role}
              onChange={(event) => updatePlayerRole(assignment.player, event.target.value as UserRole)}
              className="h-11 rounded-2xl border border-white/70 bg-white/80 px-3 text-sm font-black text-slate-950 outline-none"
            >
              {editableRoles.map((item) => (
                <option key={item} value={item}>
                  {roleLabels[item]}
                </option>
              ))}
            </select>
            <p
              className={
                assignment.role === "superuser"
                  ? "rounded-full bg-slate-900 px-3 py-2 text-center text-xs font-black text-white"
                  : assignment.role === "admin"
                    ? "rounded-full bg-lime-100 px-3 py-2 text-center text-xs font-black text-[#247e24]"
                    : assignment.role === "budgeting_booking_officer"
                      ? "rounded-full bg-amber-100 px-3 py-2 text-center text-xs font-black text-amber-700"
                      : "rounded-full bg-white/70 px-3 py-2 text-center text-xs font-black text-slate-600"
              }
            >
              {roleLabels[assignment.role]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/60 bg-white/55 p-4 text-sm text-slate-600">
        Role changes are applied immediately to the local profile system.
        <span className="mt-2 block font-extrabold text-[#247e24]">Detected access: {roleLabels[role]}</span>
      </div>
    </Card>

    <Card>
      <SectionTitle>Permission Matrix</SectionTitle>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/60 bg-white/45">
        {[
          ["View Home, Matches, Players, Finances, Insights", "All roles"],
          ["Confirm attendance / join waiting list", "All roles"],
          ["Add, edit, cancel, or delete bookings", "Superuser, Admin, Officer"],
          ["Update contributions and caisse", "Superuser, Admin, Officer"],
          ["Add or remove players", "Superuser, Admin"],
          ["Change user access", "Superuser"],
          ["Impersonate another user", "Superuser"]
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
