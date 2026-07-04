import type { TranslationKey } from "./en";

/**
 * Sinhala (si) string table. Must provide every key in `TranslationKey`;
 * TypeScript enforces completeness via the Record type below.
 * SRS-sourced strings taken verbatim from §2.
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
  "nav.logout": "පිටවීම",
  "nav.language": "භාෂාව",

  // Buttons (SRS §2.1)
  "btn.next": "මීළඟ පිටුව",
  "btn.back": "ආපසු",
  "btn.submit": "දත්ත ඇතුළත් කරන්න",
  "btn.login": "පිවිසෙන්න",
  "btn.register": "ලියාපදිංචි වන්න",
  "btn.approve": "අනුමත කරන්න",
  "btn.reject": "ප්‍රතික්ෂේප කරන්න",
  "btn.save": "සුරකින්න",

  // Status (SRS §2.1)
  "status.incomplete": "අසම්පූර්ණයි",
  "status.pending": "අනුමැතිය අපේක්ෂාවෙන්",
  "status.approved": "අනුමතයි",
  "status.rejected": "ප්‍රතික්ෂේපිතයි",

  // Auth
  "auth.admissionNo": "ඇතුළත් වීමේ අංකය",
  "auth.password": "මුරපදය",
  "auth.confirmPassword": "මුරපදය තහවුරු කරන්න",
  "auth.loginTitle": "ශිෂ්‍ය පිවිසුම",
  "auth.registerTitle": "ශිෂ්‍ය ගිණුමක් සාදන්න",
  "auth.haveAccount": "දැනටමත් ගිණුමක් තිබේද?",
  "auth.noAccount": "ගිණුමක් නොමැතිද?",

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

  // Validation / misc
  "common.required": "මෙම ක්ෂේත්‍රය අවශ්‍යයි",
  "common.loading": "පූරණය වෙමින්…",
  "common.selectPlaceholder": "තෝරන්න…",
};
