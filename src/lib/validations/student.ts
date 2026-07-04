import { z } from "zod";

import { GRADES, getSubDivisions } from "@/lib/constants/academic";

const phone = z
  .string()
  .trim()
  .regex(/^(?:\+94|0)[0-9]{9}$/, "Enter a valid phone number");

/**
 * A full student record (Academic §2.2 + Guardian §2.3), entered by a teacher
 * in one form. Fields are flat here for react-hook-form; the service maps them
 * into the nested `academicData` / `guardianData` shape on save.
 */
export const studentSchema = z
  .object({
    // Academic
    fullName: z.string().trim().min(2, "Full name is required"),
    nameWithInitials: z.string().trim().min(2, "Name with initials is required"),
    admissionNo: z
      .string()
      .trim()
      .regex(/^[0-9]{1,10}$/, "Admission number must be numeric"),
    grade: z.enum(GRADES),
    classStream: z.string().trim().min(1, "Class / stream is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    // Guardian
    guardianName: z.string().trim().min(2, "Guardian name is required"),
    contactNo: phone,
    address: z.string().trim().min(5, "Permanent address is required"),
    emergencyName: z.string().trim().min(2, "Emergency contact is required"),
    emergencyPhone: phone,
  })
  .refine(
    (d) =>
      (getSubDivisions(d.grade) as readonly string[]).includes(d.classStream),
    { path: ["classStream"], message: "Invalid class / stream for this grade" },
  );

export type StudentInput = z.infer<typeof studentSchema>;

/** Staff (TEACHER / SUPER_ADMIN) login. */
export const staffLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type StaffLoginInput = z.infer<typeof staffLoginSchema>;

/** SUPER_ADMIN provisioning a new teacher. */
export const newTeacherSchema = z.object({
  displayName: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type NewTeacherInput = z.infer<typeof newTeacherSchema>;
