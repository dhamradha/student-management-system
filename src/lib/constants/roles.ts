import type { Role } from "@/types";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const satisfies Record<string, Role>;

/** Landing route for each role after authentication. */
export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  STUDENT: "/student",
};

export function isAdminRole(role: Role): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}
