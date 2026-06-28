"use client";

import { ShieldCheck } from "lucide-react";
import { roleLabels, type UserRole } from "@/lib/access";
import { useRole } from "@/hooks/use-role";
import { Card, SectionTitle } from "@/components/ui/card";

const defaultAssignments: Array<{ player: string; role: UserRole }> = [
  { player: "Najib", role: "admin" },
  { player: "Ahmed G", role: "finance" },
  { player: "Nawfal", role: "booking" }
];

export function AccessSettings() {
  const { role } = useRole();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionTitle>Access Control</SectionTitle>
          <p className="mt-3 text-sm text-white/65">
            Everyone can view and submit attendance. Editing permissions must come from backend roles, not from a user-facing switch.
          </p>
        </div>
        <ShieldCheck className="h-8 w-8 text-lime-300" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {defaultAssignments.map((assignment) => (
          <div key={assignment.player} className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
            <p className="font-black">{assignment.player}</p>
            <p className="mt-2 rounded-full bg-lime-300/15 px-3 py-1 text-sm font-black text-lime-300">{roleLabels[assignment.role]}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.06] p-4 text-sm text-white/65">
        Current local build runs with owner access for setup. In production, Supabase Auth should load the signed-in user role from `user_roles`, and only admins should grant finance or booking roles.
        <span className="mt-2 block font-black text-lime-300">Detected setup role: {roleLabels[role]}</span>
      </div>
    </Card>
  );
}
