import { AcquisitionType, Department, Grade } from "@app/api/generated/model";
import clubFair from "@app/assets/join/club-fair.svg";
import etc from "@app/assets/join/etc.svg";
import everytime from "@app/assets/join/everytime.svg";
import friend from "@app/assets/join/friend.svg";
import instagram from "@app/assets/join/instagram.svg";
import offlineEvent from "@app/assets/join/offline-event.svg";
import type { Language } from "@app/i18n/types";
import { departments as en } from "./departments.en";
import { departments as ko } from "./departments.ko";

/** The funnel in order; each is also the path below /join. */
export const JOIN_STEPS = [
  "agreement",
  "personal-info",
  "survey",
  "chat",
  "payment",
] as const;

export type JoinStep = (typeof JOIN_STEPS)[number];

export function joinPath(step: JoinStep): string {
  return `/join/${step}`;
}

/** The step before `step`, or undefined on the first one. */
export function previousStep(step: JoinStep): JoinStep | undefined {
  return JOIN_STEPS[JOIN_STEPS.indexOf(step) - 1];
}

export function nextStep(step: JoinStep): JoinStep | undefined {
  return JOIN_STEPS[JOIN_STEPS.indexOf(step) + 1];
}

export function isJoinStep(value: string | undefined): value is JoinStep {
  return JOIN_STEPS.includes(value as JoinStep);
}

/** In the order the server lists them, which is the order people look for. */
export const DEPARTMENTS = Object.values(Department);

const DEPARTMENT_LABELS: Record<Language, Record<Department, string>> = {
  ko,
  en,
};

export function departmentLabel(value: Department, language: Language) {
  return DEPARTMENT_LABELS[language][value];
}

/** The server also accepts SIX; the form has never offered it. */
export const GRADES = [
  Grade.ONE,
  Grade.TWO,
  Grade.THREE,
  Grade.FOUR,
  Grade.FIVE,
] as const;

/** Most common answers first. */
export const ACQUISITION_TYPES = [
  { value: AcquisitionType.INSTAGRAM, icon: instagram },
  { value: AcquisitionType.EVERYTIME, icon: everytime },
  { value: AcquisitionType.FRIEND, icon: friend },
  { value: AcquisitionType.CLUB_FAIR, icon: clubFair },
  { value: AcquisitionType.OFFLINE_EVENT, icon: offlineEvent },
  { value: AcquisitionType.ETC, icon: etc },
] as const;

/**
 * What a visitor typed on a step but has not saved, kept while they move
 * back and forth so going back a step does not wipe the form. Lives as long
 * as the page does, like the rest of the funnel's progress.
 */
export const drafts: {
  personalInfo?: PersonalInfoForm;
  survey?: SurveyForm;
} = {};

export type PersonalInfoForm = {
  phoneNumber: string;
  studentId: string;
  /** YYMMDD */
  birthDate: string;
  /** The first digit after the dash in a resident registration number. */
  genderDigit: string;
  department: Department | null;
  grade: Grade | null;
};

export type SurveyForm = {
  acquisitionType: AcquisitionType | null;
  joinReason: string;
};
