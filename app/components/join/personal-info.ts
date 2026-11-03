import {
  Gender,
  type PersonalInfoResponse,
  type PersonalInfoUpdateRequest,
} from "@app/api/generated/model";
import type { PersonalInfoForm } from "./join";

/** What the validated form holds: every answer given. */
type PersonalInfoFormOutput = {
  [Key in keyof PersonalInfoForm]: NonNullable<PersonalInfoForm[Key]>;
};

/**
 * Saved answers, except the grade: it changes every year, so it is asked
 * again rather than carried over from the last time.
 */
export function fromServer(info: PersonalInfoResponse): PersonalInfoForm {
  return {
    phoneNumber: info.phoneNumber ?? "",
    studentId: info.studentId ?? "",
    birthDate: info.birthDate ?? "",
    genderDigit:
      info.birthDate && info.gender
        ? genderDigit(info.birthDate, info.gender)
        : "",
    department: info.department,
    grade: null,
  };
}

export function toRequest(
  values: PersonalInfoFormOutput
): PersonalInfoUpdateRequest {
  return {
    phoneNumber: values.phoneNumber,
    studentId: values.studentId,
    birthDate: values.birthDate,
    department: values.department,
    grade: values.grade,
    gender: Number(values.genderDigit) % 2 ? Gender.MALE : Gender.FEMALE,
  };
}

/** 1 and 2 for births in the 1900s, 3 and 4 from 2000; odd is male. */
function genderDigit(birthDate: string, gender: Gender): string {
  const before2000 = Number(birthDate.slice(0, 2)) >= 50;
  const male = gender === Gender.MALE;
  return String((before2000 ? 1 : 3) + (male ? 0 : 1));
}

export function digits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/** "01012345678" to "010-1234-5678" as it is typed. */
export function formatPhoneNumber(value: string): string {
  const raw = digits(value, 11);
  if (raw.length <= 3) return raw;
  if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
}

/** A real calendar date in YYMMDD, read as 1950 to 2049. */
export function isValidBirthDate(value: string): boolean {
  if (!/^\d{6}$/.test(value)) return false;
  const yy = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  const year = yy >= 50 ? 1900 + yy : 2000 + yy;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}
