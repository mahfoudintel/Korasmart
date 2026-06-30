"use client";

import { useEffect, useState } from "react";
import { type UserRole } from "@/lib/access";
import { isAuthRequired } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

const storageKey = "korasmart-current-role-v1";

export function useRole() {
  const { profile } = useAuth();
  const [role, setRoleState] = useState<UserRole>("member");
  const [roles, setRoles] = useState<UserRole[]>(["member"]);

  useEffect(() => {
    if (supabase && isAuthRequired) return;

    const saved = window.localStorage.getItem(storageKey);
    if (saved === "member" || saved === "admin" || saved === "finance" || saved === "booking") {
      setRoleState(saved);
      setRoles([saved]);
    } else {
      setRoleState("admin");
      setRoles(["admin"]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRole() {
      if (!supabase || !isAuthRequired || !profile?.id) return;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("player_id", profile.id);

      if (cancelled) return;

      const loadedRoles = (data || [])
        .map((item) => item.role)
        .filter((item): item is UserRole => item === "member" || item === "admin" || item === "finance" || item === "booking");
      const nextRoles: UserRole[] = loadedRoles.length ? loadedRoles : ["member"];

      setRoles(nextRoles);

      if (nextRoles.includes("admin")) setRoleState("admin");
      else if (nextRoles.includes("finance")) setRoleState("finance");
      else if (nextRoles.includes("booking")) setRoleState("booking");
      else setRoleState("member");
    }

    loadRole();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  return { role, roles };
}
