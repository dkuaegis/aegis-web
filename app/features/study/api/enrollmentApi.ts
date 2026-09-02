import { ApiError, api } from "@app/lib/api";
import { API_ENDPOINTS } from "@study/lib/apiEndpoints";
import { handleHTTPError } from "@study/lib/apiUtils";
import { isValidId } from "@study/lib/utils";
import {
  type QueryClient,
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_OPTIONS_SLOW } from "./queryOptions";

// Types
export interface EnrollmentPayload {
  applicationReason: string | null;
}

export interface EnrollmentResponse {
  message: string;
  status: "APPROVED" | "PENDING";
}

export interface StudyStatusResponse {
  studyApplicationId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface UserApplicationDetail {
  studyApplicationId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicationReason: string;
  studyTitle: string;
  studyDescription: string;
}

export interface UpdateApplicationPayload {
  applicationReason: string;
}

const ERROR_MESSAGES = {
  enrollment: {
    400: "잘못된 요청 데이터입니다.",
    403: "지원 기간이 아닙니다.",
    404: "스터디를 찾을 수 없습니다.",
    409: "이미 신청된 상태입니다.",
    default: "스터디 신청 중 오류가 발생했습니다.",
  },
  cancel: {
    400: "잘못된 요청입니다.",
    404: "스터디를 찾을 수 없습니다.",
    default: "신청 취소 중 오류가 발생했습니다.",
  },
  userApplication: {
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서 조회 중 오류가 발생했습니다.",
  },
  updateApplication: {
    400: "잘못된 요청 데이터입니다.",
    404: "지원서를 찾을 수 없습니다.",
    default: "지원서 수정 중 오류가 발생했습니다.",
  },
} as const;

export const ENROLLMENT_QUERY_KEYS = {
  studyStatus: (studyId: number) => ["studyStatus", studyId] as const,
  userApplication: (studyId: number) => ["userApplication", studyId] as const,
} as const;

function invalidateStudyQueries(
  queryClient: QueryClient,
  studyId: number
): void {
  queryClient.invalidateQueries({ queryKey: ["studyDetail", studyId] });
  queryClient.invalidateQueries({ queryKey: ["studies"] });
  queryClient.invalidateQueries({ queryKey: ["userRoles"] });
  queryClient.invalidateQueries({
    queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
  });
  queryClient.invalidateQueries({
    queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
  });
}

// API Functions
export async function enrollInStudy(
  studyId: number,
  payload: EnrollmentPayload,
  signal?: AbortSignal
): Promise<EnrollmentResponse> {
  try {
    const response = await api.post<EnrollmentResponse | null>(
      API_ENDPOINTS.STUDY_ENROLLMENT(studyId),
      payload,
      signal
    );

    const fallback: EnrollmentResponse = {
      message: "지원이 완료되었습니다.",
      status: "PENDING",
    };
    return response ?? fallback;
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.enrollment);
  }
}

export async function getStudyStatus(
  studyId: number,
  signal?: AbortSignal
): Promise<StudyStatusResponse | null> {
  try {
    return await api.get<StudyStatusResponse>(
      API_ENDPOINTS.STUDY_STATUS(studyId),
      signal
    );
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`스터디 상태 조회 중 오류: ${String(error)}`);
  }
}

export async function cancelEnrollment(
  studyId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(API_ENDPOINTS.STUDY_ENROLLMENT(studyId), signal);
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.cancel);
  }
}

export async function getUserApplicationDetail(
  studyId: number,
  signal?: AbortSignal
): Promise<UserApplicationDetail> {
  try {
    return await api.get<UserApplicationDetail>(
      API_ENDPOINTS.USER_APPLICATION(studyId),
      signal
    );
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.userApplication);
  }
}

export async function updateUserApplication(
  studyId: number,
  payload: UpdateApplicationPayload,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.put(API_ENDPOINTS.USER_APPLICATION(studyId), payload, signal);
  } catch (error: unknown) {
    handleHTTPError(error, ERROR_MESSAGES.updateApplication);
  }
}

// Query Hooks
export const useStudyStatusQuery = (
  studyId: number,
  enabled: boolean = true
): UseQueryResult<StudyStatusResponse | null, Error> => {
  return useQuery<StudyStatusResponse | null, Error>({
    queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
    queryFn: ({ signal }) => getStudyStatus(studyId, signal),
    enabled: enabled && isValidId(studyId),
    ...QUERY_OPTIONS_SLOW,
  });
};

export const useUserApplicationDetailQuery = (
  studyId: number,
  enabled: boolean = false
): UseQueryResult<UserApplicationDetail, Error> => {
  return useQuery<UserApplicationDetail, Error>({
    queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
    queryFn: ({ signal }) => getUserApplicationDetail(studyId, signal),
    enabled: enabled && isValidId(studyId),
    ...QUERY_OPTIONS_SLOW,
  });
};

// Mutation Hooks
export const useEnrollInStudyMutation = (
  studyId: number,
  onSuccess?: (data: EnrollmentResponse) => void,
  onError?: (error: Error) => void
): UseMutationResult<EnrollmentResponse, Error, EnrollmentPayload> => {
  const queryClient = useQueryClient();

  return useMutation<EnrollmentResponse, Error, EnrollmentPayload>({
    mutationFn: (payload) => enrollInStudy(studyId, payload),
    onSuccess: (data) => {
      invalidateStudyQueries(queryClient, studyId);
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

export const useCancelEnrollmentMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => cancelEnrollment(studyId),
    onSuccess: () => {
      invalidateStudyQueries(queryClient, studyId);
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

export const useUpdateUserApplicationMutation = (
  studyId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): UseMutationResult<void, Error, UpdateApplicationPayload> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateApplicationPayload>({
    mutationFn: (payload) => updateUserApplication(studyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
      });
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};
