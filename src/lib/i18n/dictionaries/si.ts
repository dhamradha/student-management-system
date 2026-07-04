import type { TranslationKey } from "./en";

/**
 * Sinhala (si) string table. Must provide every key in `TranslationKey`;
 * the Record type enforces completeness. SRS-sourced strings per §2.
 */
export const si: Record<TranslationKey, string> = {
  // App shell / branding
  "app.title": "ශිෂ්‍ය දත්ත කළමනාකරණ පද්ධතිය",
  "app.institution": "හුනුවල ධර්මරාජ මහා විද්‍යාලය",
  "app.tagline": "නිල ශිෂ්‍ය තොරතුරු ද්වාරය",

  // Navigation
  "nav.home": "මුල් පිටුව",
  "nav.dashboard": "පාලක පුවරුව",
  "nav.students": "ශිෂ්‍යයෝ",
  "nav.forms": "පෝරම",
  "nav.teachers": "ගුරුවරු",
  "nav.logout": "පිටවීම",

  // Buttons
  "btn.next": "ඊළඟ",
  "btn.back": "ආපසු",
  "btn.save": "සුරකින්න",
  "btn.cancel": "අවලංගු කරන්න",
  "btn.login": "පිවිසෙන්න",
  "btn.submit": "යොමු කරන්න",
  "btn.reject": "ප්‍රතික්ෂේප කරන්න",
  "btn.edit": "සංස්කරණය",
  "btn.delete": "මකන්න",
  "btn.addStudent": "ශිෂ්‍යයෙකු එක් කරන්න",
  "btn.addTeacher": "ගුරුවරයෙකු එක් කරන්න",

  // Auth
  "auth.email": "විද්‍යුත් තැපෑල",
  "auth.password": "මුරපදය",
  "auth.loginTitle": "කාර්ය මණ්ඩල පිවිසුම",

  // Form Phase 1 — Academic (SRS §2.2)
  "form1.title": "අධ්‍යයන තොරතුරු",
  "form1.fullName": "සම්පූර්ණ නම",
  "form1.nameWithInitials": "මුලකුරු සමඟ නම",
  "form1.admissionNo": "ඇතුළත් වීමේ අංකය",
  "form1.grade": "ශ්‍රේණිය",
  "form1.classStream": "පන්තිය / අංශය",
  "form1.dob": "උපන් දිනය",
  "form1.gender": "ස්ත්‍රී/පුරුෂ භාවය",

  // Form Phase 2 — Guardian (SRS §2.3)
  "form2.title": "මව්පිය/භාරකරුගේ තොරතුරු",
  "form2.guardianName": "භාරකරුගේ නම",
  "form2.contactNo": "ප්‍රධාන දුරකථන අංකය",
  "form2.address": "ස්ථිර ලිපිනය",
  "form2.emergencyName": "හදිසි අවස්ථාවකදී දැනුම් දිය යුතු නම",
  "form2.emergencyPhone": "හදිසි දුරකථන අංකය",

  // Gender options
  "gender.Male": "පිරිමි",
  "gender.Female": "ගැහැණු",
  "gender.Other": "වෙනත්",

  // Students console
  "student.newTitle": "නව ශිෂ්‍යයා",
  "student.editTitle": "ශිෂ්‍ය තොරතුරු සංස්කරණය",
  "student.count": "ශිෂ්‍යයෝ",

  // Teachers console
  "teacher.title": "ගුරු ගිණුම්",
  "teacher.name": "නම",
  "teacher.newTitle": "ගුරුවරයෙකු එක් කරන්න",

  // Common
  "common.loading": "පූරණය වෙමින්…",
  "common.selectPlaceholder": "තෝරන්න…",
  "common.actions": "ක්‍රියා",
  "common.noResults": "වාර්තා නොමැත.",
  "common.confirmDelete": "විශ්වාසද? මෙය පසුව වෙනස් කළ නොහැක.",
  "common.all": "සියල්ල",
};
