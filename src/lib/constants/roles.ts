import type { Role } from "@/types";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  TEACHER: "TEACHER",
} as const satisfies Record<string, Role>;

/** Every staff role lands on the student console after login. */
export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/students",
  TEACHER: "/students",
};

export function isSuperAdmin(role: Role | undefined): boolean {
  return role === ROLES.SUPER_ADMIN;
}

export function isStaff(role: Role | undefined): boolean {
  return role === ROLES.TEACHER || role === ROLES.SUPER_ADMIN;
}
