/** Types for the teacher-built, student-facing forms feature. */

/** Field input types available in the builder. */
export type FieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "dropdown"
  | "radio"
  | "checkbox";

/**
 * Known student attributes a field can map to. When a submission is approved,
 * mapped answers pre-fill the student record; the form's grade is applied
 * separately (grade is fixed per form, not asked in the form).
 */
export type StudentFieldKey =
  | "fullName"
  | "nameWithInitials"
  | "admissionNo"
  | "classStream"
  | "dob"
  | "gender"
  | "guardianName"
  | "contactNo"
  | "address"
  | "emergencyName"
  | "emergencyPhone";

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; // regex source
  patternMessage?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  helpText?: string;
  placeholder?: string;
  options: string[]; // used by dropdown / radio / checkbox
  mapTo: StudentFieldKey | null;
  validation: FieldValidation;
}

export type FormStatus = "draft" | "published";

export interface FormDoc {
  id: string;
  title: string;
  description: string;
  /** Grades this form targets. If more than one, the student picks theirs. */
  grades: string[];
  /** Allowed class/streams. Empty = not asked; >1 = the student picks theirs. */
  classStreams: string[];
  status: FormStatus;
  fields: FormField[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  grade: string;
  classStream: string | null;
  /** Raw answers keyed by field id. */
  answers: Record<string, string | string[]>;
  /** Answers keyed by mapped student attribute (for prefilling on approval). */
  mapped: Record<string, string>;
  status: SubmissionStatus;
  submittedAt: string;
}
