/**
 * English (en) string table. This is the canonical dictionary — its keys define
 * the `TranslationKey` type, and every other locale must supply the same keys.
 * Keys prefixed btn./status./form1./form2. come directly from the SRS (§2).
 */
export const en = {
  // App shell / branding
  "app.title": "Student Data Management System",
  "app.institution": "Hunuwala Dharmaraja Vidyalaya",
  "app.tagline": "Official student records portal",

  // Navigation
  "nav.home": "Home",
  "nav.dashboard": "Dashboard",
  "nav.students": "Students",
  "nav.logout": "Log out",
  "nav.language": "Language",

  // Buttons (SRS §2.1)
  "btn.next": "Next Step",
  "btn.back": "Back",
  "btn.submit": "Submit Application",
  "btn.login": "Log in",
  "btn.register": "Register",
  "btn.approve": "Approve",
  "btn.reject": "Reject",
  "btn.save": "Save",

  // Status (SRS §2.1)
  "status.incomplete": "Incomplete",
  "status.pending": "Pending Verification",
  "status.approved": "Verified Profile",
  "status.rejected": "Rejected",

  // Auth
  "auth.admissionNo": "Admission Number",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.loginTitle": "Student Log In",
  "auth.registerTitle": "Create Student Account",
  "auth.haveAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account?",

  // Form Phase 1 — Academic (SRS §2.2)
  "form1.title": "Academic Profile",
  "form1.fullName": "Full Name",
  "form1.nameWithInitials": "Name with Initials",
  "form1.admissionNo": "Admission Number",
  "form1.grade": "Grade",
  "form1.classStream": "Class / Stream",
  "form1.dob": "Date of Birth",
  "form1.gender": "Gender",

  // Form Phase 2 — Guardian (SRS §2.3)
  "form2.title": "Guardian Details",
  "form2.guardianName": "Guardian Name",
  "form2.contactNo": "Primary Contact Number",
  "form2.address": "Permanent Address",
  "form2.emergencyName": "Emergency Contact Person",
  "form2.emergencyPhone": "Emergency Phone Number",

  // Gender options
  "gender.Male": "Male",
  "gender.Female": "Female",
  "gender.Other": "Other",

  // Validation / misc
  "common.required": "This field is required",
  "common.loading": "Loading…",
  "common.selectPlaceholder": "Select…",
} as const;

export type TranslationKey = keyof typeof en;
