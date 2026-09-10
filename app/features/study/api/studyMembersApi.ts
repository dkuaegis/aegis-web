import { t } from "@app/i18n/store";
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
      return t("study.errors.notInstructor");
    case 404:
      return t("study.errors.studyNotFound");
    default:
      return t("study.errors.membersFetch");
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
    throw new Error(t("study.errors.membersFetch"));
  }
}
