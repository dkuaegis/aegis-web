import { t } from "@app/i18n/store";
import { ApiError, api } from "@app/lib/api";
import { STUDY_DETAIL_QUERY_KEY } from "@study/api/studyDetailApi";
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

function getEditStudyErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return t("study.errors.badRequestData");
    case 403:
      return t("study.errors.notInstructor");
    case 404:
      return t("study.errors.studyNotFound");
    default:
      return t("study.errors.studyUpdate");
  }
}

async function updateStudy(
  studyId: number,
  data: StudyFormData
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
    await api.put(`${API_ENDPOINTS.STUDIES}/${studyId}`, requestData);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw new Error(getEditStudyErrorMessage(err.status));
    }
    throw new Error(t("study.errors.studyUpdate"));
  }
}

export const useUpdateStudyMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): UseMutationResult<void, unknown, StudyFormData> => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, StudyFormData>({
    mutationFn: (data: StudyFormData) => updateStudy(studyId, data),
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
