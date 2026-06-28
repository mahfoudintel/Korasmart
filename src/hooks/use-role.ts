"use client";

import { useEffect, useState } from "react";
import { type UserRole } from "@/lib/access";

const storageKey = "korasmart-current-role-v1";

export function useRole() {
  const [role, setRoleState] = useState<UserRole>("admin");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "member" || saved === "admin" || saved === "finance" || saved === "booking") {
      setRoleState(saved);
    }
  }, []);

  return { role };
}
