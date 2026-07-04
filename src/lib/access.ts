export type UserRole = "superuser" | "admin" | "budgeting_booking_officer" | "player";
export type LegacyUserRole = "member" | "finance" | "booking";

export const roleLabels: Record<UserRole, string> = {
  superuser: "Superuser",
  admin: "Admin",
  budgeting_booking_officer: "Budgeting & Booking officer",
  player: "Player"
};

export const accessAssignmentsStorageKey = "korasmart-access-assignments-v1";
export const accessAssignmentsChangedEvent = "korasmart-access-assignments-changed";

export const defaultRoleAssignments: Record<string, UserRole> = {
  Najib: "superuser",
  Nawfal: "admin"
};

export function normalizeRole(role: UserRole | LegacyUserRole | string | null | undefined): UserRole {
  if (role === "superuser") return "superuser";
  if (role === "admin") return "admin";
  if (role === "budgeting_booking_officer" || role === "finance" || role === "booking") return "budgeting_booking_officer";
  return "player";
}

function readSavedRoleAssignments(): Record<string, UserRole> {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(accessAssignmentsStorageKey);
    if (!saved) return {};

    const parsed = JSON.parse(saved) as Record<string, string>;
    return Object.fromEntries(Object.entries(parsed).map(([playerName, role]) => [playerName, normalizeRole(role)]));
  } catch {
    window.localStorage.removeItem(accessAssignmentsStorageKey);
    return {};
  }
}

export function getAccessAssignments(): Record<string, UserRole> {
  return { ...defaultRoleAssignments, ...readSavedRoleAssignments() };
}

export function getRoleForPlayer(playerName: string | null | undefined): UserRole {
  if (!playerName) return "player";
  return getAccessAssignments()[playerName] || "player";
}

export function setRoleForPlayer(playerName: string, role: UserRole) {
  if (typeof window === "undefined") return;

  const savedAssignments = readSavedRoleAssignments();
  const defaultRole = defaultRoleAssignments[playerName] || "player";
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === defaultRole) {
    delete savedAssignments[playerName];
  } else {
    savedAssignments[playerName] = normalizedRole;
  }

  window.localStorage.setItem(accessAssignmentsStorageKey, JSON.stringify(savedAssignments));
  window.dispatchEvent(new Event(accessAssignmentsChangedEvent));
}

export function resetAccessAssignments() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(accessAssignmentsStorageKey);
  window.dispatchEvent(new Event(accessAssignmentsChangedEvent));
}

export const canManageFinances = (role: UserRole) => role === "superuser" || role === "admin" || role === "budgeting_booking_officer";
export const canManageSchedule = (role: UserRole) => role === "superuser" || role === "admin" || role === "budgeting_booking_officer";
export const canManageMembers = (role: UserRole) => role === "superuser" || role === "admin";
export const canManageRoles = (role: UserRole) => role === "superuser";
export const canImpersonate = (role: UserRole) => role === "superuser";
export const canEditFinance = canManageFinances;
export const canEditBookings = canManageSchedule;
