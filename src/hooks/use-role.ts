"use client";

import { useEffect, useState } from "react";
import { normalizeRole, type UserRole } from "@/lib/access";

const storageKey = "korasmart-current-role-v1";

export function useRole() {
  const [role, setRoleState] = useState<UserRole>("admin");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    setRoleState(normalizeRole(saved));
  }, []);

  return { role };
}
