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
      return "잘못된 출석 코드입니다.";
    case 403:
      return "스터디원이 아닙니다.";
    case 404:
      return "오늘 진행되는 세션이 없습니다.";
    case 409:
      return "이미 출석이 완료되었습니다.";
    default:
      return "출석 처리 중 오류가 발생했습니다.";
  }
}

export function getAttendanceCodeErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 403:
      return "스터디장이 아닙니다.";
    case 404:
      return "스터디를 찾을 수 없습니다.";
    default:
      return "출석 코드 발급 중 오류가 발생했습니다.";
  }
}

export function getAttendanceInstructorErrorMessage(
  statusCode: number
): string {
  switch (statusCode) {
    case 403:
      return "스터디장이 아닙니다.";
    case 404:
      return "스터디를 찾을 수 없습니다.";
    default:
      return "출석 정보를 불러오는 중 오류가 발생했습니다.";
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
    throw new Error("출석 코드 발급 중 오류가 발생했습니다.");
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
    throw new Error("출석 처리 중 오류가 발생했습니다.");
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
    throw new Error("출석 정보를 불러오는 중 오류가 발생했습니다.");
  }
}
