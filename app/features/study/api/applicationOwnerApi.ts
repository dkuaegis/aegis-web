import { apiClient } from "@study/lib/apiClient";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import { handleHTTPError } from "@study/lib/apiUtils";
import { isValidId } from "@study/lib/utils";
import {
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_OPTIONS_FAST, QUERY_OPTIONS_SLOW } from "./queryOptions";

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

export interface UpdateApplicationStatusPayload {
  status: "APPROVED" | "REJECTED";
}

// constants
const ERROR_MESSAGES = {
  fetchApplications: {
    403: "스터디장이 아닙니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원자 목록을 불러오는 중 오류가 발생했습니다.",
  },
  fetchApplicationText: {
    403: "스터디장이 아닙니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서를 불러오는 중 오류가 발생했습니다.",
  },
  updateStatus: {
    403: "스터디장이 아닙니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서 상태 변경 중 오류가 발생했습니다.",
  },
  approve: {
    403: "스터디장이 아닙니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서 승인 중 오류가 발생했습니다.",
  },
  reject: {
    403: "스터디장이 아닙니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서 거절 중 오류가 발생했습니다.",
  },
} as const;

// Query Keys
export const APPLICATION_QUERY_KEYS = {
  studyApplications: (studyId: number) =>
    ["studyApplications", studyId] as const,
  applicationText: (studyId: number, applicationId: number) =>
    ["applicationText", studyId, applicationId] as const,
} as const;

// API Functions
export async function fetchStudyApplications(
  studyId: number,
  signal?: AbortSignal
): Promise<ApplicationApiResponse[]> {
  try {
    return await apiClient
      .get(API_ENDPOINTS.STUDY_APPLICATIONS(studyId), { signal })
      .json<ApplicationApiResponse[]>();
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
    return await apiClient
      .get(API_ENDPOINTS.APPLICATION_DETAIL(studyId, applicationId), {
        signal,
      })
      .json<ApplicationTextResponse>();
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.fetchApplicationText);
  }
}

export async function updateApplicationStatus(
  studyId: number,
  applicationId: number,
  payload: UpdateApplicationStatusPayload,
  signal?: AbortSignal
): Promise<void> {
  try {
    await apiClient.patch(
      API_ENDPOINTS.UPDATE_APPLICATION_STATUS(studyId, applicationId),
      {
        json: payload,
        signal,
      }
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.updateStatus);
  }
}

export async function approveApplication(
  studyId: number,
  applicationId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await apiClient.put(
      API_ENDPOINTS.APPROVE_APPLICATION(studyId, applicationId),
      {
        signal,
      }
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.approve);
  }
}

export async function rejectApplication(
  studyId: number,
  applicationId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await apiClient.put(
      API_ENDPOINTS.REJECT_APPLICATION(studyId, applicationId),
      {
        signal,
      }
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

export const useApplicationTextQuery = (
  studyId: number,
  applicationId: number,
  enabled: boolean = true
): UseQueryResult<ApplicationTextResponse, Error> => {
  return useQuery<ApplicationTextResponse, Error>({
    queryKey: APPLICATION_QUERY_KEYS.applicationText(studyId, applicationId),
    queryFn: ({ signal }) =>
      fetchApplicationText(studyId, applicationId, signal),
    enabled: enabled && isValidId(studyId) && isValidId(applicationId),
    ...QUERY_OPTIONS_SLOW,
  });
};

// Mutation Hooks
export const useUpdateApplicationStatusMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseMutationResult<
  void,
  Error,
  { applicationId: number; status: "APPROVED" | "REJECTED" }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { applicationId: number; status: "APPROVED" | "REJECTED" }
  >({
    mutationFn: ({ applicationId, status }) =>
      updateApplicationStatus(studyId, applicationId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
      });
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

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
      queryClient.invalidateQueries({
        queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
      });
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
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
      queryClient.invalidateQueries({
        queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
      });
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};
