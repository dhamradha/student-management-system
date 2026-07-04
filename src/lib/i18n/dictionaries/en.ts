/**
 * English (en) string table. This is the canonical dictionary — its keys define
 * the `TranslationKey` type, and every other locale must supply the same keys.
 * form1.* / form2.* strings come from the SRS (§2).
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
  "nav.teacherRecords": "Teacher Records",
  "nav.forms": "Forms",
  "nav.teachers": "Teachers",
  "nav.logout": "Log out",

  // Buttons
  "btn.next": "Next",
  "btn.back": "Back",
  "btn.save": "Save",
  "btn.cancel": "Cancel",
  "btn.login": "Log in",
  "btn.submit": "Submit",
  "btn.reject": "Reject",
  "btn.edit": "Edit",
  "btn.delete": "Delete",
  "btn.addStudent": "Add Student",
  "btn.addTeacher": "Add Teacher",

  // Auth
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.loginTitle": "Staff Log In",

  // Form Phase 1 — Academic (SRS §2.2)
  "form1.title": "Academic Details",
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

  // Students console
  "student.newTitle": "New Student",
  "student.editTitle": "Edit Student",
  "student.count": "students",

  // Teachers console
  "teacher.title": "Teacher Accounts",
  "teacher.name": "Name",
  "teacher.newTitle": "Add a Teacher",

  // Common
  "common.loading": "Loading…",
  "common.selectPlaceholder": "Select…",
  "common.actions": "Actions",
  "common.noResults": "No records found.",
  "common.confirmDelete": "Are you sure? This cannot be undone.",
  "common.all": "All",
} as const;

export type TranslationKey = keyof typeof en;
