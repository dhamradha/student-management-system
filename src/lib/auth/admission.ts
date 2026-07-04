import { STUDENT_EMAIL_DOMAIN } from "@/lib/firebase/config";

/**
 * Students authenticate with their admission number, not an email address.
 * Firebase Auth requires an email, so we deterministically synthesise one:
 *   admission "9732" -> "9732@students.hunuwala.lk"
 * Firebase's built-in email uniqueness then guarantees admission numbers are
 * unique across the institution.
 */
export function admissionToEmail(admissionNo: string): string {
  return `${admissionNo.trim().toLowerCase()}@${STUDENT_EMAIL_DOMAIN}`;
}
