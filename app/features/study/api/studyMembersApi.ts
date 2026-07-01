import { apiClient, HTTPError } from "@study/lib/apiClient";
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
    return await apiClient
      .get(API_ENDPOINTS.STUDY_MEMBERS_INSTRUCTOR(studyId), { signal })
      .json<StudyMemberApiResponse[]>();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") throw err;

    if (err instanceof HTTPError) {
      const message = getStudyMembersErrorMessage(err.response.status);
      throw new Error(message);
    }
    throw new Error("스터디원 정보를 불러오지 못했습니다.");
  }
}
