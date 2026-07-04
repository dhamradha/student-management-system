import type {
  FieldType,
  FormField,
  FormTarget,
  MapKey,
} from "@/types/forms";

interface FieldTypeMeta {
  value: FieldType;
  label: string;
  hasOptions: boolean; // dropdown / radio / checkbox
  numeric: boolean; // supports min / max
  textual: boolean; // supports minLength / maxLength / pattern
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { value: "short_text", label: "Short text", hasOptions: false, numeric: false, textual: true },
  { value: "long_text", label: "Paragraph", hasOptions: false, numeric: false, textual: true },
  { value: "number", label: "Number", hasOptions: false, numeric: true, textual: false },
  { value: "email", label: "Email", hasOptions: false, numeric: false, textual: false },
  { value: "phone", label: "Phone", hasOptions: false, numeric: false, textual: false },
  { value: "date", label: "Date", hasOptions: false, numeric: false, textual: false },
  { value: "dropdown", label: "Dropdown", hasOptions: true, numeric: false, textual: false },
  { value: "radio", label: "Multiple choice", hasOptions: true, numeric: false, textual: false },
  { value: "checkbox", label: "Checkboxes", hasOptions: true, numeric: false, textual: false },
];

export function fieldTypeMeta(type: FieldType): FieldTypeMeta {
  return FIELD_TYPES.find((f) => f.value === type) ?? FIELD_TYPES[0];
}

interface MapField {
  key: MapKey;
  label: string;
}

/** Student attributes a field can map to. `grade` is fixed per form, not here. */
export const MAPPABLE_STUDENT_FIELDS: MapField[] = [
  { key: "fullName", label: "Full Name" },
  { key: "nameWithInitials", label: "Name with Initials" },
  { key: "admissionNo", label: "Admission Number" },
  { key: "classStream", label: "Class / Stream" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "guardianName", label: "Guardian Name" },
  { key: "contactNo", label: "Primary Contact Number" },
  { key: "address", label: "Permanent Address" },
  { key: "emergencyName", label: "Emergency Contact Person" },
  { key: "emergencyPhone", label: "Emergency Phone Number" },
];

/** Teacher attributes a field can map to. */
export const MAPPABLE_TEACHER_FIELDS: MapField[] = [
  { key: "fullName", label: "Full Name" },
  { key: "nameWithInitials", label: "Name with Initials" },
  { key: "nic", label: "NIC" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "contactNo", label: "Contact Number" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "subject", label: "Subject" },
  { key: "qualifications", label: "Qualifications" },
];

export function mappableFields(target: FormTarget): MapField[] {
  return target === "teacher"
    ? MAPPABLE_TEACHER_FIELDS
    : MAPPABLE_STUDENT_FIELDS;
}

export const NONE_MAP = "__none__";

/**
 * The default "student intake" template — the standard student data dictionary
 * (SRS §2), pre-mapped. Grade & class are chosen at the form level, so they are
 * not fields here. Call this to seed a new form with sensible defaults.
 */
interface FieldSeed {
  label: string;
  type: FieldType;
  mapTo: MapKey;
  required: boolean;
  options?: string[];
}

const DEFAULT_STUDENT_SEEDS: FieldSeed[] = [
  { label: "Full Name", type: "short_text", mapTo: "fullName", required: true },
  { label: "Name with Initials", type: "short_text", mapTo: "nameWithInitials", required: true },
  { label: "Admission Number", type: "short_text", mapTo: "admissionNo", required: true },
  { label: "Date of Birth", type: "date", mapTo: "dob", required: true },
  { label: "Gender", type: "radio", mapTo: "gender", required: true, options: ["Male", "Female", "Other"] },
  { label: "Guardian Name", type: "short_text", mapTo: "guardianName", required: true },
  { label: "Primary Contact Number", type: "phone", mapTo: "contactNo", required: true },
  { label: "Permanent Address", type: "long_text", mapTo: "address", required: true },
  { label: "Emergency Contact Person", type: "short_text", mapTo: "emergencyName", required: true },
  { label: "Emergency Phone Number", type: "phone", mapTo: "emergencyPhone", required: true },
];

const DEFAULT_TEACHER_SEEDS: FieldSeed[] = [
  { label: "Full Name", type: "short_text", mapTo: "fullName", required: true },
  { label: "Name with Initials", type: "short_text", mapTo: "nameWithInitials", required: true },
  { label: "NIC", type: "short_text", mapTo: "nic", required: true },
  { label: "Gender", type: "radio", mapTo: "gender", required: false, options: ["Male", "Female", "Other"] },
  { label: "Date of Birth", type: "date", mapTo: "dob", required: false },
  { label: "Contact Number", type: "phone", mapTo: "contactNo", required: true },
  { label: "Email", type: "email", mapTo: "email", required: false },
  { label: "Address", type: "long_text", mapTo: "address", required: false },
  { label: "Subject", type: "short_text", mapTo: "subject", required: false },
  { label: "Qualifications", type: "long_text", mapTo: "qualifications", required: false },
];

function buildFields(seeds: FieldSeed[]): FormField[] {
  return seeds.map((seed) => ({
    id: crypto.randomUUID(),
    label: seed.label,
    type: seed.type,
    required: seed.required,
    options: seed.options ?? [],
    mapTo: seed.mapTo,
    validation: {},
  }));
}

export function buildDefaultStudentFields(): FormField[] {
  return buildFields(DEFAULT_STUDENT_SEEDS);
}

export function buildDefaultTeacherFields(): FormField[] {
  return buildFields(DEFAULT_TEACHER_SEEDS);
}
