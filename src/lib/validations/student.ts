import { z } from "zod";

import { GRADES, getSubDivisions } from "@/lib/constants/academic";

const admissionNo = z
  .string()
  .trim()
  .min(1, "Admission number is required")
  .regex(/^[0-9]{1,10}$/, "Admission number must be numeric");

/** Sri Lankan phone: 10 digits, optionally +94 prefixed. */
const phone = z
  .string()
  .trim()
  .regex(/^(?:\+94|0)[0-9]{9}$/, "Enter a valid phone number");

/** Form Phase 1 — Academic (SRS §2.2). */
export const academicSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    nameWithInitials: z.string().trim().min(2, "Name with initials is required"),
    admissionNo,
    grade: z.enum(GRADES),
    classStream: z.string().trim().min(1, "Class / stream is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
  })
  .refine(
    (data) =>
      (getSubDivisions(data.grade) as readonly string[]).includes(
        data.classStream,
      ),
    { path: ["classStream"], message: "Invalid class / stream for this grade" },
  );

/** Form Phase 2 — Guardian (SRS §2.3). */
export const guardianSchema = z.object({
  guardianName: z.string().trim().min(2, "Guardian name is required"),
  contactNo: phone,
  address: z.string().trim().min(5, "Permanent address is required"),
  emergencyName: z.string().trim().min(2, "Emergency contact person is required"),
  emergencyPhone: phone,
});

/** Auth — admission-number login + registration. */
export const loginSchema = z.object({
  admissionNo,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema
  .extend({ confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type AcademicInput = z.infer<typeof academicSchema>;
export type GuardianInput = z.infer<typeof guardianSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
