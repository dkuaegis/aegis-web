import type { HTTPError } from "@study/lib/apiClient";
import { apiClient } from "@study/lib/apiClient";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type { StudyListItem } from "@study/types/study";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { QUERY_OPTIONS_SLOW } from "./queryOptions";

export const STUDIES_QUERY_KEY = ["studies"] as const;

async function fetchStudies(signal?: AbortSignal): Promise<StudyListItem[]> {
  return apiClient
    .get(API_ENDPOINTS.STUDIES, { signal })
    .json<StudyListItem[]>();
}

export const useStudyListQuery = (): UseQueryResult<
  StudyListItem[],
  HTTPError
> => {
  return useQuery<StudyListItem[], HTTPError>({
    queryKey: STUDIES_QUERY_KEY,
    queryFn: ({ signal }) => fetchStudies(signal),
    ...QUERY_OPTIONS_SLOW,
  });
};
