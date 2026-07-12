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
    const syncRole = () => {
      if (!profile.loggedIn) {
        setRole("player");
        return;
      }

      if (profile.impersonatorPlayerName) {
        setRole(getRoleForPlayer(profile.playerName));
        return;
      }

      setRole(authProfile?.role || getRoleForPlayer(profile.playerName));
    };
    syncRole();

    window.addEventListener("storage", syncRole);
    window.addEventListener(accessAssignmentsChangedEvent, syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener(accessAssignmentsChangedEvent, syncRole);
    };
  }, [authProfile?.role, profile.impersonatorPlayerName, profile.loggedIn, profile.playerName]);

  return { role };
}
