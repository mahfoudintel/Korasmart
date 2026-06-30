export type UserRole = "member" | "admin" | "finance" | "booking";

export const roleLabels: Record<UserRole, string> = {
  member: "Player",
  admin: "Administrator",
  finance: "Budget officer",
  booking: "Booking officer"
};

export type UserRoleInput = UserRole | UserRole[];

const hasRole = (roleInput: UserRoleInput, role: UserRole) =>
  Array.isArray(roleInput) ? roleInput.includes(role) : roleInput === role;

export const canEditFinance = (roleInput: UserRoleInput) => hasRole(roleInput, "admin") || hasRole(roleInput, "finance");
export const canEditBookings = (roleInput: UserRoleInput) => hasRole(roleInput, "admin") || hasRole(roleInput, "booking");
export const canManageRoles = (roleInput: UserRoleInput) => hasRole(roleInput, "admin");
