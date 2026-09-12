import { t } from "@app/i18n/store";
import { ApiError, api } from "@app/lib/api";

export interface AttendanceCodeResponse {
  code: string;
  sessionId: number;
}

export interface AttendanceSubmissionResponse {
  attendanceId: number;
  sessionId: number;
}

export function getAttendanceErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return t("study.errors.invalidAttendanceCode");
    case 403:
      return t("study.errors.notMember");
    case 404:
      return t("study.errors.noSessionToday");
    case 409:
      return t("study.errors.alreadyAttended");
    default:
      return t("study.errors.attendanceSubmit");
  }
}

export function getAttendanceCodeErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 403:
      return t("study.errors.notInstructor");
    case 404:
      return t("study.errors.studyNotFound");
    default:
      return t("study.errors.attendanceCodeIssue");
  }
}

export function getAttendanceInstructorErrorMessage(
  statusCode: number
): string {
  switch (statusCode) {
    case 403:
      return t("study.errors.notInstructor");
    case 404:
      return t("study.errors.studyNotFound");
    default:
      return t("study.errors.attendanceFetch");
  }
}

export async function fetchAttendanceCode(
  studyId: number
): Promise<AttendanceCodeResponse> {
  try {
    const res = await api.post<AttendanceCodeResponse>(
      `studies/${studyId}/attendance-code`
    );
    return res;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const message = getAttendanceCodeErrorMessage(err.status);
      throw new Error(message);
    }
    throw new Error(t("study.errors.attendanceCodeIssue"));
  }
}

export async function submitAttendanceCode(
  studyId: number,
  code: string
): Promise<AttendanceSubmissionResponse> {
  try {
    const res = await api.post<AttendanceSubmissionResponse>(
      `studies/${studyId}/attendance`,
      { code }
    );
    return res;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const message = getAttendanceErrorMessage(err.status);
      throw new Error(message);
    }
    throw new Error(t("study.errors.attendanceSubmit"));
  }
}

export interface AttendanceSession {
  sessionId: number;
  date: string;
}

export interface AttendanceMember {
  memberId: number;
  name: string;
  attendance: boolean[];
}

export interface AttendanceInstructorResponse {
  sessions: AttendanceSession[];
  members: AttendanceMember[];
}

//출석조회(스터디장)
export async function fetchAttendanceInstructor(
  studyId: number,
  signal?: AbortSignal
): Promise<AttendanceInstructorResponse> {
  try {
    const res = await api.get<AttendanceInstructorResponse>(
      `studies/${studyId}/attendance-instructor`,
      signal
    );
    return res;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const message = getAttendanceInstructorErrorMessage(err.status);
      throw new Error(message);
    }
    throw new Error(t("study.errors.attendanceFetch"));
  }
}
