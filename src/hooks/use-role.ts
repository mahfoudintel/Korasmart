"use client";

import { getRoleForPlayer } from "@/lib/access";
import { useLocalProfile } from "@/hooks/use-local-profile";

export function useRole() {
  const { profile } = useLocalProfile();
  const role = profile.loggedIn ? getRoleForPlayer(profile.playerName) : "player";

  return { role };
}
