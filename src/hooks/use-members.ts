"use client";

import { useEffect, useMemo, useState } from "react";
import { players as defaultPlayers } from "@/lib/data";

export type Member = (typeof defaultPlayers)[number];

const membersStorageKey = "korasmart-members-v1";

type StoredMembers = {
  added: Member[];
  removedNames: string[];
};

const blankMemberStats = {
  position: "Member",
  goals: 0,
  assists: 0,
  wins: 0,
  mvps: 0,
  rating: 0,
  skill: 0,
  speed: 0,
  stamina: 0,
  passing: 0,
  defense: 0,
  shooting: 0
};

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function loadStoredMembers(): StoredMembers {
  if (typeof window === "undefined") return { added: [], removedNames: [] };

  try {
    const saved = window.localStorage.getItem(membersStorageKey);
    if (!saved) return { added: [], removedNames: [] };

    const parsed = JSON.parse(saved) as Partial<StoredMembers>;
    return {
      added: Array.isArray(parsed.added) ? parsed.added.filter((member) => member?.name) : [],
      removedNames: Array.isArray(parsed.removedNames) ? parsed.removedNames : []
    };
  } catch {
    window.localStorage.removeItem(membersStorageKey);
    return { added: [], removedNames: [] };
  }
}

export function useMembers() {
  const [stored, setStored] = useState<StoredMembers>({ added: [], removedNames: [] });

  useEffect(() => {
    setStored(loadStoredMembers());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(membersStorageKey, JSON.stringify(stored));
  }, [stored]);

  const members = useMemo(() => {
    const removed = new Set(stored.removedNames.map((name) => name.toLowerCase()));
    const defaultActive = defaultPlayers.filter((player) => !removed.has(player.name.toLowerCase()));
    const customActive = stored.added.filter((member) => !removed.has(member.name.toLowerCase()));
    return [...defaultActive, ...customActive];
  }, [stored.added, stored.removedNames]);

  const addMember = (name: string) => {
    const cleanName = normalizeName(name);
    if (!cleanName) return { ok: false, message: "Enter a member name." };

    const alreadyExists = [...defaultPlayers, ...stored.added].some(
      (member) => member.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (alreadyExists && !stored.removedNames.some((removed) => removed.toLowerCase() === cleanName.toLowerCase())) {
      return { ok: false, message: "This member already exists." };
    }

    setStored((current) => {
      const restoredRemovedNames = current.removedNames.filter((removed) => removed.toLowerCase() !== cleanName.toLowerCase());
      const existsInDefault = defaultPlayers.some((member) => member.name.toLowerCase() === cleanName.toLowerCase());
      const existsInAdded = current.added.some((member) => member.name.toLowerCase() === cleanName.toLowerCase());

      return {
        added: existsInDefault || existsInAdded ? current.added : [...current.added, { name: cleanName, ...blankMemberStats }],
        removedNames: restoredRemovedNames
      };
    });

    return { ok: true, message: "Member added." };
  };

  const removeMember = (name: string) => {
    setStored((current) => ({
      added: current.added.filter((member) => member.name !== name),
      removedNames: current.removedNames.includes(name) ? current.removedNames : [...current.removedNames, name]
    }));
  };

  return {
    members,
    defaultCount: defaultPlayers.length,
    addedCount: stored.added.length,
    removedCount: stored.removedNames.length,
    addMember,
    removeMember
  };
}
