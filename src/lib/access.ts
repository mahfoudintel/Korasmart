export type UserRole = "admin" | "budgeting_booking_officer" | "player";
export type LegacyUserRole = "member" | "finance" | "booking";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  budgeting_booking_officer: "Budgeting & Booking officer",
  player: "Player"
};

export function normalizeRole(role: UserRole | LegacyUserRole | string | null | undefined): UserRole {
  if (role === "admin") return "admin";
  if (role === "budgeting_booking_officer" || role === "finance" || role === "booking") return "budgeting_booking_officer";
  return "player";
}

export const adminPlayers = new Set(["Najib", "Nawfal"]);

export function getRoleForPlayer(playerName: string | null | undefined): UserRole {
  return playerName && adminPlayers.has(playerName) ? "admin" : "player";
}

export const canManageFinances = (role: UserRole) => role === "admin" || role === "budgeting_booking_officer";
export const canManageSchedule = (role: UserRole) => role === "admin" || role === "budgeting_booking_officer";
export const canManageMembers = (role: UserRole) => role === "admin";
export const canManageRoles = (role: UserRole) => role === "admin";
export const canEditFinance = canManageFinances;
export const canEditBookings = canManageSchedule;
