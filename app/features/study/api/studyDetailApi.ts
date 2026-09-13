import { type ApiError, api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type { StudyDetail } from "@study/types/study";
import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";

// Ky에서 발생할 수 있는 모든 오류 타입을 포괄하는 유니온 타입
type StudyDetailError = ApiError | DOMException | TypeError;

export const STUDY_DETAIL_QUERY_KEY = (studyId: number) =>
  ["studyDetail", studyId] as const;

export async function fetchStudyDetail(
  studyId: number,
  signal?: AbortSignal
): Promise<StudyDetail> {
  return api.get<StudyDetail>(`${API_ENDPOINTS.STUDIES}/${studyId}`, signal);
}

type StudyDetailQueryOptions = Omit<
  UseQueryOptions<
    StudyDetail,
    StudyDetailError,
    StudyDetail,
    ReturnType<typeof STUDY_DETAIL_QUERY_KEY>
  >,
  "queryKey" | "queryFn"
>;

export const useStudyDetailQuery = (
  studyId: number,
  options?: StudyDetailQueryOptions
): UseQueryResult<StudyDetail, StudyDetailError> => {
  const { enabled: optEnabled, ...rest } = options ?? {};
  const enabled =
    Number.isFinite(studyId) && studyId > 0 && (optEnabled ?? true);
  return useQuery<
    StudyDetail,
    StudyDetailError,
    StudyDetail,
    ReturnType<typeof STUDY_DETAIL_QUERY_KEY>
  >({
    queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
    queryFn: ({ signal }) => fetchStudyDetail(studyId, signal),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    ...rest,
  });
};
