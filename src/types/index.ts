/**
 * Domain types for the Student Data Management System.
 * Mirrors the Architecture Blueprint in the SRS (§5).
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export type Gender = "Male" | "Female" | "Other";

/** Lifecycle of a student profile as it moves through onboarding + review. */
export type ApprovalStatus = "incomplete" | "pending" | "approved" | "rejected";

/** Form Phase 1 — Academic Data Dictionary (SRS §2.2). */
export interface AcademicData {
  fullName: string;
  nameWithInitials: string;
  admissionNo: string;
  grade: string;
  classStream: string;
  dob: string; // ISO date (YYYY-MM-DD)
  gender: Gender;
}

/** Form Phase 2 — Guardian Data Dictionary (SRS §2.3). */
export interface GuardianData {
  guardianName: string;
  contactNo: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
}

/**
 * The Firestore `users/{uid}` document. One document per authenticated user,
 * keyed by their Firebase Auth UID (SRS §5).
 */
export interface UserDoc {
  uid: string;
  role: Role;
  isApproved: boolean;
  status: ApprovalStatus;
  institution: string;
  admissionNo: string | null;
  academicData: AcademicData | null;
  guardianData: GuardianData | null;
  /** Which onboarding phase the student has completed (0, 1, or 2). */
  onboardingStep: 0 | 1 | 2;
  createdAt: string;
  updatedAt: string;
}

export type StudentDoc = UserDoc & { role: "STUDENT" };
