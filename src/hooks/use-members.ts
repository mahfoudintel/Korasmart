"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { players as defaultPlayers } from "@/lib/data";
import { supabase } from "@/lib/supabase";

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
  const { session } = useAuth();
  const [stored, setStored] = useState<StoredMembers>({ added: [], removedNames: [] });
  const [remoteMembers, setRemoteMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    setStored(loadStoredMembers());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteMembers() {
      if (!supabase || !session) {
        setRemoteMembers(null);
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select("name, position, skill, speed, stamina, passing, defense, shooting, is_active")
        .order("created_at", { ascending: true });

      if (cancelled) return;
      if (error || !data) {
        setRemoteMembers(null);
        return;
      }

      setRemoteMembers(
        data
          .filter((player) => player.is_active !== false)
          .map((player) => ({
            name: player.name,
            position: player.position || "Member",
            goals: 0,
            assists: 0,
            wins: 0,
            mvps: 0,
            rating: 0,
            skill: Number(player.skill || 0),
            speed: Number(player.speed || 0),
            stamina: Number(player.stamina || 0),
            passing: Number(player.passing || 0),
            defense: Number(player.defense || 0),
            shooting: Number(player.shooting || 0)
          }))
      );
    }

    loadRemoteMembers();

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    window.localStorage.setItem(membersStorageKey, JSON.stringify(stored));
  }, [stored]);

  const members = useMemo(() => {
    if (remoteMembers) return remoteMembers;

    const removed = new Set(stored.removedNames.map((name) => name.toLowerCase()));
    const defaultActive = defaultPlayers.filter((player) => !removed.has(player.name.toLowerCase()));
    const customActive = stored.added.filter((member) => !removed.has(member.name.toLowerCase()));
    return [...defaultActive, ...customActive];
  }, [remoteMembers, stored.added, stored.removedNames]);

  const addMember = async (name: string) => {
    const cleanName = normalizeName(name);
    if (!cleanName) return { ok: false, message: "Enter a member name." };

    const alreadyExists = [...members, ...stored.added].some(
      (member) => member.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (alreadyExists && (!remoteMembers || !stored.removedNames.some((removed) => removed.toLowerCase() === cleanName.toLowerCase()))) {
      return { ok: false, message: "This member already exists." };
    }

    if (supabase && session) {
      const { error } = await supabase.from("players").upsert(
        {
          name: cleanName,
          position: "Member",
          is_active: true
        },
        { onConflict: "name" }
      );

      if (error) return { ok: false, message: "Could not add player in Supabase." };
      setRemoteMembers((current) => [...(current || []), { name: cleanName, ...blankMemberStats }]);
      return { ok: true, message: "Player added." };
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

    return { ok: true, message: "Player added." };
  };

  const removeMember = async (name: string) => {
    if (supabase && session) {
      const { error } = await supabase.from("players").update({ is_active: false }).eq("name", name);
      if (!error) setRemoteMembers((current) => (current || []).filter((member) => member.name !== name));
      return;
    }

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
