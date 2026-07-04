"use client";

import { useEffect, useState } from "react";
import { accessAssignmentsChangedEvent, getRoleForPlayer, type UserRole } from "@/lib/access";
import { useLocalProfile } from "@/hooks/use-local-profile";

export function useRole() {
  const { profile } = useLocalProfile();
  const [role, setRole] = useState<UserRole>("player");

  useEffect(() => {
    const syncRole = () => setRole(profile.loggedIn ? getRoleForPlayer(profile.playerName) : "player");
    syncRole();

    window.addEventListener("storage", syncRole);
    window.addEventListener(accessAssignmentsChangedEvent, syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener(accessAssignmentsChangedEvent, syncRole);
    };
  }, [profile.loggedIn, profile.playerName]);

  return { role };
}
