"use client";

import { useEffect, useState } from "react";
import { players } from "@/lib/data";

export type LocalProfile = {
  playerName: string;
  displayName: string;
  avatarDataUrl: string;
  avatarPreset: string;
  loggedIn: boolean;
};

const storageKey = "korasmart-local-profile-v1";
const profileChangedEvent = "korasmart-local-profile-changed";

const defaultProfile: LocalProfile = {
  playerName: players[0].name,
  displayName: players[0].name,
  avatarDataUrl: "",
  avatarPreset: "/images/avatars/avatar-01.png",
  loggedIn: true
};

function readProfile(): LocalProfile {
  if (typeof window === "undefined") return defaultProfile;

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return defaultProfile;

    return { ...defaultProfile, ...(JSON.parse(saved) as Partial<LocalProfile>) };
  } catch {
    window.localStorage.removeItem(storageKey);
    return defaultProfile;
  }
}

function saveProfile(profile: LocalProfile) {
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
  window.dispatchEvent(new Event(profileChangedEvent));
}

export function useLocalProfile() {
  const [profile, setProfileState] = useState<LocalProfile>(defaultProfile);

  useEffect(() => {
    const syncProfile = () => setProfileState(readProfile());
    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener(profileChangedEvent, syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener(profileChangedEvent, syncProfile);
    };
  }, []);

  const setProfile = (nextProfile: LocalProfile) => {
    setProfileState(nextProfile);
    saveProfile(nextProfile);
  };

  const updateProfile = (patch: Partial<LocalProfile>) => {
    setProfile({ ...profile, ...patch });
  };

  const login = () => updateProfile({ loggedIn: true });
  const logout = () => updateProfile({ loggedIn: false });

  return {
    profile,
    setProfile,
    updateProfile,
    login,
    logout
  };
}
