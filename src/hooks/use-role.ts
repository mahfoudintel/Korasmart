"use client";

import { useEffect, useState } from "react";
import { accessAssignmentsChangedEvent, getRoleForPlayer, type UserRole } from "@/lib/access";
import { useAuth } from "@/components/auth-provider";
import { useLocalProfile } from "@/hooks/use-local-profile";

export function useRole() {
  const { profile: authProfile } = useAuth();
  const { profile } = useLocalProfile();
  const [role, setRole] = useState<UserRole>("player");

  useEffect(() => {
    const syncRole = () => setRole(authProfile?.role || (profile.loggedIn ? getRoleForPlayer(profile.playerName) : "player"));
    syncRole();

    window.addEventListener("storage", syncRole);
    window.addEventListener(accessAssignmentsChangedEvent, syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener(accessAssignmentsChangedEvent, syncRole);
    };
  }, [authProfile?.role, profile.loggedIn, profile.playerName]);

  return { role };
}
