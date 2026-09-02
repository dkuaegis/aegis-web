import { type ApiError, api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import type { UserStudyRoles } from "@study/types/user";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { QUERY_OPTIONS_SLOW } from "./queryOptions";

export const USER_ROLES_QUERY_KEY = ["userRoles"] as const;

async function fetchUserStudyRoles(
  signal?: AbortSignal
): Promise<UserStudyRoles> {
  return api.get<UserStudyRoles>(`${API_ENDPOINTS.STUDIES}/roles`, signal);
}

export const useUserStudyRolesQuery = (): UseQueryResult<
  UserStudyRoles,
  ApiError
> => {
  return useQuery<UserStudyRoles, ApiError>({
    queryKey: USER_ROLES_QUERY_KEY,
    queryFn: ({ signal }) => fetchUserStudyRoles(signal),
    ...QUERY_OPTIONS_SLOW,
  });
};
