import { STUDY_DETAIL_QUERY_KEY } from "@study/api/studyDetailApi";
import { apiClient, HTTPError } from "@study/lib/apiClient";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type { StudyRecruitmentMethod } from "@study/types/study";
import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface UpdateStudyRequest {
  title: string;
  category: string;
  level: string;
  description: string;
  recruitmentMethod: StudyRecruitmentMethod;
  maxParticipants: number;
  schedule: string;
  curricula: string[];
  qualifications: string[];
}

interface CurriculumItem {
  value: string;
}

interface RequirementItem {
  value: string;
}

export interface StudyFormData {
  title: string;
  category: string;
  difficulty: string;
  introduction: string;
  recruitmentMethod: StudyRecruitmentMethod;
  maxParticipants: string;
  schedule: string;
  curriculum: CurriculumItem[];
  requirements: RequirementItem[];
}

export function getEditStudyErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "잘못된 요청 데이터입니다.";
    case 403:
      return "스터디장이 아닙니다.";
    case 404:
      return "스터디를 찾을 수 없습니다.";
    default:
      return "스터디 수정 중 오류가 발생했습니다.";
  }
}

export async function updateStudy(
  studyId: number,
  data: StudyFormData,
  signal?: AbortSignal
): Promise<void> {
  const requestData: UpdateStudyRequest = {
    title: data.title,
    category: data.category,
    level: data.difficulty,
    description: data.introduction,
    recruitmentMethod: data.recruitmentMethod, // enum 값을 그대로 사용
    maxParticipants: parseInt(data.maxParticipants, 10),
    schedule: data.schedule,
    curricula: data.curriculum
      .map((item: CurriculumItem) => item.value.trim())
      .filter((v) => v !== ""),
    qualifications: data.requirements
      .map((item: RequirementItem) => item.value.trim())
      .filter((v) => v !== ""),
  };

  try {
    await apiClient.put(`${API_ENDPOINTS.STUDIES}/${studyId}`, {
      json: requestData,
      signal,
    });
  } catch (err: unknown) {
    const name =
      typeof err === "object" && err !== null && "name" in err
        ? (err as { name?: unknown }).name
        : undefined;
    if (
      name === "AbortError" ||
      name === "CanceledError" ||
      name === "CancelledError"
    ) {
      throw err as Error;
    }
    if (err instanceof HTTPError) {
      const message = getEditStudyErrorMessage(err.response.status);
      throw new Error(message);
    }
    throw new Error("스터디 수정 중 오류가 발생했습니다.");
  }
}

export const useUpdateStudyMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): UseMutationResult<void, unknown, StudyFormData> => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, StudyFormData>({
    mutationFn: async (data: StudyFormData) => {
      const controller = new AbortController();
      return updateStudy(studyId, data, controller.signal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
      });
      queryClient.invalidateQueries({ queryKey: ["studies"] });

      if (onSuccess) onSuccess();
    },
    onError,
  });
};
