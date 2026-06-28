export type UserRole = "member" | "admin" | "finance" | "booking";

export const roleLabels: Record<UserRole, string> = {
  member: "Member",
  admin: "Admin",
  finance: "Finance",
  booking: "Booking"
};

export const canEditFinance = (role: UserRole) => role === "admin" || role === "finance";
export const canEditBookings = (role: UserRole) => role === "admin" || role === "booking";
export const canManageRoles = (role: UserRole) => role === "admin";
