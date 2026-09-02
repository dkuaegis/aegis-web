import { type ApiError, api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type { StudyListItem } from "@study/types/study";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { QUERY_OPTIONS_SLOW } from "./queryOptions";

export const STUDIES_QUERY_KEY = ["studies"] as const;

async function fetchStudies(signal?: AbortSignal): Promise<StudyListItem[]> {
  return api.get<StudyListItem[]>(API_ENDPOINTS.STUDIES, signal);
}

export const useStudyListQuery = (): UseQueryResult<
  StudyListItem[],
  ApiError
> => {
  return useQuery<StudyListItem[], ApiError>({
    queryKey: STUDIES_QUERY_KEY,
    queryFn: ({ signal }) => fetchStudies(signal),
    ...QUERY_OPTIONS_SLOW,
  });
};
