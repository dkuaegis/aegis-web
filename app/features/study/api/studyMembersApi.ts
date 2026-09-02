import { ApiError, api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";

export interface StudyMemberApiResponse {
  name: string;
  studentId: string;
  phoneNumber: string;
}

export function getStudyMembersErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 403:
      return "스터디장이 아닙니다.";
    case 404:
      return "스터디를 찾을 수 없습니다.";
    default:
      return "스터디원 정보를 불러오지 못했습니다.";
  }
}

export async function fetchStudyMembers(
  studyId: number,
  signal?: AbortSignal
): Promise<StudyMemberApiResponse[]> {
  try {
    return await api.get<StudyMemberApiResponse[]>(
      API_ENDPOINTS.STUDY_MEMBERS_INSTRUCTOR(studyId),
      signal
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") throw err;

    if (err instanceof ApiError) {
      const message = getStudyMembersErrorMessage(err.status);
      throw new Error(message);
    }
    throw new Error("스터디원 정보를 불러오지 못했습니다.");
  }
}
