import { api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import { handleHTTPError } from "@study/lib/apiUtils";
import { isValidId } from "@study/lib/utils";
import {
  type QueryClient,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_OPTIONS_FAST } from "./queryOptions";
import { STUDY_DETAIL_QUERY_KEY } from "./studyDetailApi";

// Types
export interface ApplicationApiResponse {
  studyApplicationId: number;
  name: string;
  studentId: string;
  phoneNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationTextResponse {
  applicationReason: string;
}

// constants
/**
 * Translation keys rather than finished strings: `handleHTTPError` resolves
 * them when a request fails, so the message follows the selected language.
 */
const ERROR_MESSAGES = {
  fetchApplications: {
    403: "study.errors.notInstructor",
    404: "study.errors.applicationNotFound",
    default: "study.errors.applicationsFetch",
  },
  fetchApplicationText: {
    403: "study.errors.notInstructor",
    404: "study.errors.applicationNotFound",
    default: "study.errors.applicationFetch",
  },
  approve: {
    403: "study.errors.notInstructor",
    404: "study.errors.applicationNotFound",
    STUDY_FULL: "study.errors.studyFull",
    default: "study.errors.applicationApprove",
  },
  reject: {
    403: "study.errors.notInstructor",
    404: "study.errors.applicationNotFound",
    default: "study.errors.applicationReject",
  },
} as const;

// Query Keys
const APPLICATION_QUERY_KEYS = {
  studyApplications: (studyId: number) =>
    ["studyApplications", studyId] as const,
  applicationText: (studyId: number, applicationId: number) =>
    ["applicationText", studyId, applicationId] as const,
} as const;

// API Functions
async function fetchStudyApplications(
  studyId: number,
  signal?: AbortSignal
): Promise<ApplicationApiResponse[]> {
  try {
    return await api.get<ApplicationApiResponse[]>(
      API_ENDPOINTS.STUDY_APPLICATIONS(studyId),
      signal
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.fetchApplications);
  }
}

export async function fetchApplicationText(
  studyId: number,
  applicationId: number,
  signal?: AbortSignal
): Promise<ApplicationTextResponse> {
  try {
    return await api.get<ApplicationTextResponse>(
      API_ENDPOINTS.APPLICATION_DETAIL(studyId, applicationId),
      signal
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.fetchApplicationText);
  }
}

async function approveApplication(
  studyId: number,
  applicationId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.put(
      API_ENDPOINTS.APPROVE_APPLICATION(studyId, applicationId),
      undefined,
      signal
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.approve);
  }
}

async function rejectApplication(
  studyId: number,
  applicationId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.put(
      API_ENDPOINTS.REJECT_APPLICATION(studyId, applicationId),
      undefined,
      signal
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.reject);
  }
}

// Query Hooks
type StudyApplicationsQueryOptions = Omit<
  UseQueryOptions<
    ApplicationApiResponse[],
    Error,
    ApplicationApiResponse[],
    ReturnType<typeof APPLICATION_QUERY_KEYS.studyApplications>
  >,
  "queryKey" | "queryFn"
>;

export const useStudyApplicationsQuery = (
  studyId: number,
  options?: StudyApplicationsQueryOptions
): UseQueryResult<ApplicationApiResponse[], Error> => {
  const { enabled: optEnabled, ...rest } = options ?? {};
  const enabled = isValidId(studyId) && (optEnabled ?? true);
  return useQuery<
    ApplicationApiResponse[],
    Error,
    ApplicationApiResponse[],
    ReturnType<typeof APPLICATION_QUERY_KEYS.studyApplications>
  >({
    queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
    queryFn: ({ signal }) => fetchStudyApplications(studyId, signal),
    enabled,
    ...QUERY_OPTIONS_FAST,
    ...rest,
  });
};

// Mutation Hooks
// 승인하면 참여 인원이 바뀌므로 상세와 목록도 다시 불러옵니다.
function invalidateAfterReview(queryClient: QueryClient, studyId: number) {
  queryClient.invalidateQueries({
    queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
  });
  queryClient.invalidateQueries({ queryKey: STUDY_DETAIL_QUERY_KEY(studyId) });
  queryClient.invalidateQueries({ queryKey: ["studies"] });
  queryClient.invalidateQueries({ queryKey: ["userRoles"] });
}

export const useApproveApplicationMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (applicationId: number) =>
      approveApplication(studyId, applicationId),
    onSuccess: () => {
      invalidateAfterReview(queryClient, studyId);
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

export const useRejectApplicationMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (applicationId: number) =>
      rejectApplication(studyId, applicationId),
    onSuccess: () => {
      invalidateAfterReview(queryClient, studyId);
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};
