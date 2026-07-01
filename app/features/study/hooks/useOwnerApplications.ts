import {
  type ApplicationApiResponse,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useStudyApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@study/api/applicationOwnerApi";
import { useStudyDetailQuery } from "@study/api/studyDetailApi";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import type { Application, StudyData } from "@study/types/study";
import { ApplicationStatus } from "@study/types/study";
import { useEffect, useMemo, useState } from "react";

function transformApiApplication(apiApp: ApplicationApiResponse): Application {
  return {
    id: apiApp.studyApplicationId,
    name: apiApp.name,
    phone: apiApp.phoneNumber,
    studentNumber: apiApp.studentId,
    status: apiApp.status as ApplicationStatus,
    createdAt: apiApp.createdAt,
    updatedAt: apiApp.updatedAt,
  };
}

export function useApplications(studyId: number) {
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | ApplicationStatus
  >("ALL");

  // 사용자 역할 확인
  const { isInstructor, isLoading: isRoleLoading } = useUserRole();

  // 권한 확인
  const isOwner = isInstructor(studyId);
  const canLoadStudyDetail = !isRoleLoading && isOwner;

  // API 쿼리 사용
  const {
    data: apiApplications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useStudyApplicationsQuery(studyId, { enabled: canLoadStudyDetail });

  const {
    data: studyDetail,
    isLoading: studyLoading,
    error: studyError,
  } = useStudyDetailQuery(studyId, { enabled: canLoadStudyDetail });

  // 상태 업데이트 뮤테이션들
  const toast = useToast();

  const approveMutation = useApproveApplicationMutation(
    studyId,
    undefined,
    (error) => {
      const name =
        typeof error === "object" && error !== null && "name" in error
          ? (error as { name?: unknown }).name
          : undefined;
      if (
        name === "AbortError" ||
        name === "CanceledError" ||
        name === "CancelledError"
      ) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : "지원서 승인 중 오류가 발생했습니다.";
      toast({ description: message });
    }
  );

  const rejectMutation = useRejectApplicationMutation(
    studyId,
    undefined,
    (error) => {
      const name =
        typeof error === "object" && error !== null && "name" in error
          ? (error as { name?: unknown }).name
          : undefined;
      if (
        name === "AbortError" ||
        name === "CanceledError" ||
        name === "CancelledError"
      ) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : "지원서 거절 중 오류가 발생했습니다.";
      toast({ description: message });
    }
  );

  const statusMutation = useUpdateApplicationStatusMutation(
    studyId,
    undefined,
    (error) => {
      const name =
        typeof error === "object" && error !== null && "name" in error
          ? (error as { name?: unknown }).name
          : undefined;
      if (
        name === "AbortError" ||
        name === "CanceledError" ||
        name === "CancelledError"
      ) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : "지원서 상태 변경 중 오류가 발생했습니다.";
      toast({ description: message });
    }
  );

  // 에러 처리
  const error =
    applicationsError?.message ||
    studyError?.message ||
    statusMutation.error?.message ||
    approveMutation.error?.message ||
    rejectMutation.error?.message ||
    null;

  // 응답 에러(목록/스터디 정보 등)를 토스트로 표시
  useEffect(() => {
    if (applicationsError) {
      const name =
        typeof applicationsError === "object" &&
        applicationsError !== null &&
        "name" in applicationsError
          ? (applicationsError as { name?: unknown }).name
          : undefined;
      if (
        name !== "AbortError" &&
        name !== "CanceledError" &&
        name !== "CancelledError"
      ) {
        const message =
          applicationsError instanceof Error
            ? applicationsError.message
            : "지원자 목록을 불러오는 중 오류가 발생했습니다.";
        toast({ description: message });
      }
    }
    if (studyError) {
      const name =
        typeof studyError === "object" &&
        studyError !== null &&
        "name" in studyError
          ? (studyError as { name?: unknown }).name
          : undefined;
      if (
        name !== "AbortError" &&
        name !== "CanceledError" &&
        name !== "CancelledError"
      ) {
        const message =
          studyError instanceof Error
            ? studyError.message
            : "스터디 정보를 불러오는 중 오류가 발생했습니다.";
        toast({ description: message });
      }
    }
  }, [applicationsError, studyError, toast]);

  // 데이터 변환
  const applications = useMemo(
    () => apiApplications?.map(transformApiApplication) || [],
    [apiApplications]
  );

  // 필터링된 지원서
  const filteredApplications = useMemo(
    () =>
      applications.filter(
        (app) => selectedFilter === "ALL" || app.status === selectedFilter
      ),
    [applications, selectedFilter]
  );

  // 통계
  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter(
        (app) => app.status === ApplicationStatus.PENDING
      ).length,
      approved: applications.filter(
        (app) => app.status === ApplicationStatus.APPROVED
      ).length,
      rejected: applications.filter(
        (app) => app.status === ApplicationStatus.REJECTED
      ).length,
    }),
    [applications]
  );

  // 상태 변경 핸들러
  const handleStatusChange = (
    applicationId: number,
    newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED
  ) => {
    if (newStatus === ApplicationStatus.APPROVED) {
      approveMutation.mutate(applicationId);
    } else if (newStatus === ApplicationStatus.REJECTED) {
      rejectMutation.mutate(applicationId);
    }
  };

  // 실제 API에서 가져온 스터디 정보 사용
  const studyInfo: StudyData | null = useMemo(
    () =>
      studyDetail
        ? {
            studyTitle: studyDetail.title,
            recruitmentMethod: studyDetail.recruitmentMethod,
            applications,
          }
        : null,
    [studyDetail, applications]
  );

  return {
    applications,
    filteredApplications,
    selectedFilter,
    setSelectedFilter,
    stats,
    handleStatusChange,
    studyInfo,
    loading:
      applicationsLoading ||
      studyLoading ||
      statusMutation.isPending ||
      approveMutation.isPending ||
      rejectMutation.isPending,
    error,
  };
}
