import { api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type {
  StudyCategory,
  StudyLevel,
  StudyRecruitmentMethod,
} from "@study/types/study";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateStudyPayload {
  title: string;
  category: StudyCategory;
  level: StudyLevel;
  description: string;
  recruitmentMethod: StudyRecruitmentMethod;
  maxParticipants: number | null;
  schedule: string;
  curricula: string[];
  qualifications: string[];
}

export async function createStudy(
  payload: CreateStudyPayload
): Promise<unknown> {
  return api.post(API_ENDPOINTS.STUDIES, payload);
}

export const useCreateStudyMutation = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudy,
    onSuccess: (res: unknown) => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      if (onSuccess) onSuccess(res);
    },
    onError: (err: unknown) => {
      if (onError) onError(err);
    },
  });
};
