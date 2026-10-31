import { t } from "@app/i18n/store";
import {
  type ApplicationApiResponse,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useStudyApplicationsQuery,
} from "@study/api/applicationOwnerApi";
import { useStudyDetailQuery } from "@study/api/studyDetailApi";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import type { Application, StudyData } from "@study/types/study";
import { ApplicationStatus } from "@study/types/study";
import { useMemo, useState } from "react";

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
    refetch: refetchApplications,
  } = useStudyApplicationsQuery(studyId, { enabled: canLoadStudyDetail });

  const {
    data: studyDetail,
    isLoading: studyLoading,
    error: studyError,
    refetch: refetchStudyDetail,
  } = useStudyDetailQuery(studyId, { enabled: canLoadStudyDetail });

  // 상태 변경 실패는 토스트로만 알리고 목록 화면은 유지합니다.
  const toast = useToast();
  const showReviewError = (error: Error, fallbackKey: string) => {
    toast({ description: error.message || t(fallbackKey) });
  };

  const approveMutation = useApproveApplicationMutation(
    studyId,
    undefined,
    (error) => showReviewError(error, "study.applications.card.approveError")
  );

  const rejectMutation = useRejectApplicationMutation(
    studyId,
    undefined,
    (error) => showReviewError(error, "study.applications.card.rejectError")
  );

  const error = applicationsError?.message || studyError?.message || null;

  const retry = () => {
    void refetchApplications();
    void refetchStudyDetail();
  };

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
    if (approveMutation.isPending || rejectMutation.isPending) return;
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
    loading: applicationsLoading || studyLoading,
    isUpdating: approveMutation.isPending || rejectMutation.isPending,
    error,
    retry,
  };
}
