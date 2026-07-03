"use client";

import { useEffect, useState } from "react";
import { getRoleForPlayer } from "@/lib/access";
import { players } from "@/lib/data";

export type LocalProfile = {
  username: string;
  playerName: string;
  displayName: string;
  avatarDataUrl: string;
  avatarPreset: string;
  loggedIn: boolean;
  impersonatorUsername?: string;
  impersonatorPlayerName?: string;
  impersonatorDisplayName?: string;
  impersonatorAvatarDataUrl?: string;
  impersonatorAvatarPreset?: string;
};

type LocalUser = {
  username: string;
  password: string;
  playerName: string;
  avatarPreset: string;
};

const storageKey = "korasmart-local-profile-v1";
const usersStorageKey = "korasmart-local-users-v1";
const profileChangedEvent = "korasmart-local-profile-changed";

const normalizeUsername = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const defaultUsers: LocalUser[] = players.map((player, index) => ({
  username: normalizeUsername(player.name),
  password: "kora2026",
  playerName: player.name,
  avatarPreset: `/images/avatars/avatar-${String((index % 20) + 1).padStart(2, "0")}.png`
}));

function getDefaultUserForPlayer(playerName: string) {
  return defaultUsers.find((user) => user.playerName === playerName);
}

const defaultProfile: LocalProfile = {
  username: defaultUsers[0].username,
  playerName: players[0].name,
  displayName: players[0].name,
  avatarDataUrl: "",
  avatarPreset: "/images/avatars/avatar-01.png",
  loggedIn: true
};

function readUsers(): LocalUser[] {
  if (typeof window === "undefined") return defaultUsers;

  try {
    const saved = window.localStorage.getItem(usersStorageKey);
    if (!saved) {
      window.localStorage.setItem(usersStorageKey, JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    const savedUsers = JSON.parse(saved) as LocalUser[];
    return defaultUsers.map((defaultUser) => ({
      ...defaultUser,
      ...(savedUsers.find((user) => user.username === defaultUser.username) || {})
    }));
  } catch {
    window.localStorage.removeItem(usersStorageKey);
    return defaultUsers;
  }
}

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
  const loginWithCredentials = (username: string, password: string) => {
    const normalizedUsername = normalizeUsername(username);
    const user = readUsers().find((item) => item.username === normalizedUsername && item.password === password);
    if (!user) return false;

    const samePlayer = profile.playerName === user.playerName;

    setProfile({
      ...profile,
      username: user.username,
      playerName: user.playerName,
      displayName: samePlayer ? profile.displayName : user.playerName,
      avatarDataUrl: samePlayer ? profile.avatarDataUrl : "",
      avatarPreset: samePlayer ? profile.avatarPreset : user.avatarPreset,
      loggedIn: true,
      impersonatorUsername: undefined,
      impersonatorPlayerName: undefined,
      impersonatorDisplayName: undefined,
      impersonatorAvatarDataUrl: undefined,
      impersonatorAvatarPreset: undefined
    });

    return true;
  };
  const logout = () => updateProfile({ loggedIn: false });
  const impersonatePlayer = (playerName: string) => {
    if (!profile.loggedIn) return false;
    const sourcePlayerName = profile.impersonatorPlayerName || profile.playerName;
    if (getRoleForPlayer(sourcePlayerName) !== "admin") return false;

    const user = getDefaultUserForPlayer(playerName);
    if (!user) return false;

    setProfile({
      ...profile,
      impersonatorUsername: profile.impersonatorUsername || profile.username,
      impersonatorPlayerName: sourcePlayerName,
      impersonatorDisplayName: profile.impersonatorDisplayName || profile.displayName,
      impersonatorAvatarDataUrl: profile.impersonatorAvatarDataUrl ?? profile.avatarDataUrl,
      impersonatorAvatarPreset: profile.impersonatorAvatarPreset || profile.avatarPreset,
      username: user.username,
      playerName: user.playerName,
      displayName: user.playerName,
      avatarDataUrl: "",
      avatarPreset: user.avatarPreset,
      loggedIn: true
    });

    return true;
  };
  const stopImpersonating = () => {
    if (!profile.impersonatorPlayerName) return;

    setProfile({
      ...profile,
      username: profile.impersonatorUsername || profile.username,
      playerName: profile.impersonatorPlayerName,
      displayName: profile.impersonatorDisplayName || profile.impersonatorPlayerName,
      avatarDataUrl: profile.impersonatorAvatarDataUrl || "",
      avatarPreset: profile.impersonatorAvatarPreset || getDefaultUserForPlayer(profile.impersonatorPlayerName)?.avatarPreset || profile.avatarPreset,
      impersonatorUsername: undefined,
      impersonatorPlayerName: undefined,
      impersonatorDisplayName: undefined,
      impersonatorAvatarDataUrl: undefined,
      impersonatorAvatarPreset: undefined,
      loggedIn: true
    });
  };

  return {
    profile,
    setProfile,
    updateProfile,
    login,
    loginWithCredentials,
    logout,
    impersonatePlayer,
    stopImpersonating
  };
}
