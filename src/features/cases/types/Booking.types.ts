
export type Locale = "en" | "ar";

export interface Translations {
  titleCreate: string;
  titleUpdate: string;
  steps: [string, string, string];
  stepSubs: [string, string, string];
  next: string;
  back: string;
  confirm: string;
  saveChanges: string;
  cancel: string;
  locationPlaceholder: string;
  locationLabel: string;
  startTime: string;
  endTime: string;
  duration: string;
  summary: string;
  booking: string;
  saving: string;
  dateLabel: string;
  timeLabel: string;
  errorFields: string;
  errorTime: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    titleCreate: "Schedule New Session",
    titleUpdate: "Update Session",
    steps: ["Date", "Time", "Location"],
    stepSubs: [
      "Choose a date for the session",
      "Set the start and end time",
      "Where will the session take place?",
    ],
    next: "Next",
    back: "Back",
    confirm: "Confirm Booking",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    locationPlaceholder: "e.g. Clinic A – Room 3",
    locationLabel: "Location",
    startTime: "Start time",
    endTime: "End time",
    duration: "Duration",
    summary: "Booking Summary",
    booking: "Booking...",
    saving: "Saving...",
    dateLabel: "Date",
    timeLabel: "Time",
    errorFields: "Please fill in all fields",
    errorTime: "End time must be after start time",
  },
  ar: {
    titleCreate: "حجز جلسة جديدة",
    titleUpdate: "تحديث الجلسة",
    steps: ["التاريخ", "الوقت", "الموقع"],
    stepSubs: [
      "اختر تاريخ الجلسة",
      "حدد وقت البداية والنهاية",
      "أين ستُعقد الجلسة؟",
    ],
    next: "التالي",
    back: "رجوع",
    confirm: "تأكيد الحجز",
    saveChanges: "حفظ التعديلات",
    cancel: "إلغاء",
    locationPlaceholder: "مثال: عيادة أ – غرفة 3",
    locationLabel: "الموقع",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    duration: "المدة",
    summary: "ملخص الحجز",
    booking: "جاري الحجز...",
    saving: "جاري الحفظ...",
    dateLabel: "التاريخ",
    timeLabel: "الوقت",
    errorFields: "يرجى ملء جميع الحقول",
    errorTime: "يجب أن يكون وقت النهاية بعد وقت البداية",
  },
};
