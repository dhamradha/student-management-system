/**
 * Domain types for the Student Data Management System.
 *
 * Model: students are *records* (no accounts). Only staff authenticate —
 * TEACHERs manage student data; a SUPER_ADMIN provisions teacher access.
 */

export type Role = "SUPER_ADMIN" | "TEACHER";

export type Gender = "Male" | "Female" | "Other";

/** Academic Data Dictionary (SRS §2.2). */
export interface AcademicData {
  fullName: string;
  nameWithInitials: string;
  admissionNo: string;
  grade: string;
  classStream: string;
  dob: string; // ISO date (YYYY-MM-DD)
  gender: Gender;
}

/** Guardian Data Dictionary (SRS §2.3). */
export interface GuardianData {
  guardianName: string;
  contactNo: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
}

/** A staff account — `users/{uid}`, keyed by Firebase Auth UID. */
export interface UserDoc {
  uid: string;
  role: Role;
  email: string;
  displayName: string;
  institution: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A student record — `students/{admissionNo}`. Managed entirely by staff;
 * the document id is the admission number (unique per student).
 */
export interface StudentRecord {
  id: string;
  academicData: AcademicData;
  guardianData: GuardianData;
  createdBy: string; // teacher uid
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** Teacher directory profile (data only — not a login account). */
export interface TeacherProfileData {
  fullName: string;
  nameWithInitials: string;
  nic: string;
  gender: string;
  dob: string;
  contactNo: string;
  email: string;
  address: string;
  subject: string;
  qualifications: string;
}

/**
 * A teacher directory record — `teacherRecords/{nic}`. Profile data managed by
 * staff; separate from staff login accounts (`users`).
 */
export interface TeacherRecord {
  id: string;
  profile: TeacherProfileData;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}
