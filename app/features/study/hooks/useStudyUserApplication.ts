import { t } from "@app/i18n/store";
import {
  useEnrollInStudyMutation,
  useStudyStatusQuery,
  useUpdateUserApplicationMutation,
  useUserApplicationDetailQuery,
} from "@study/api/enrollmentApi";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import {
  ApplicationStatus,
  StudyRecruitmentMethod,
  type UserApplicationStatus,
} from "@study/types/study";
import { useState } from "react";

interface UseStudyApplicationProps {
  studyId: number;
  recruitmentMethod: StudyRecruitmentMethod;
}

export const useStudyApplication = ({
  studyId,
  recruitmentMethod,
}: UseStudyApplicationProps) => {
  const [applicationText, setApplicationText] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [shouldLoadApplicationDetail, setShouldLoadApplicationDetail] =
    useState(false);

  const [editingApplicationText, setEditingApplicationText] = useState("");

  const toast = useToast();

  // 사용자 역할 훅
  const { hasApplied, isLoading: isRoleLoading } = useUserRole();

  // 선착순(FCFS)인 경우 서버의 /status 호출을 하지 않고
  // 사용자 역할로 참여 여부를 판별한다. 이때 role 로딩 중이면 대기.
  const shouldFetchStatus = recruitmentMethod !== StudyRecruitmentMethod.FCFS;

  const statusQueryEnabled = shouldFetchStatus && !isRoleLoading;
  const { data: statusData, isLoading: isStatusQueryLoading } =
    useStudyStatusQuery(studyId, statusQueryEnabled);

  const isStatusLoading = isRoleLoading || isStatusQueryLoading;
  let userApplicationStatus: UserApplicationStatus = null;
  if (!shouldFetchStatus) {
    userApplicationStatus =
      !isRoleLoading && hasApplied(studyId) ? ApplicationStatus.APPROVED : null;
  } else if (statusData) {
    userApplicationStatus = statusData.status as ApplicationStatus;
  }

  // 지원서 상세 조회 쿼리 (PENDING 상태이고 APPLICATION 방식일 때 자동 활성화)
  const shouldAutoLoadApplication =
    userApplicationStatus === ApplicationStatus.PENDING &&
    recruitmentMethod === StudyRecruitmentMethod.APPLICATION;

  const {
    isLoading: isLoadingApplicationDetail,
    refetch: refetchApplicationDetail,
  } = useUserApplicationDetailQuery(
    studyId,
    shouldLoadApplicationDetail || shouldAutoLoadApplication
  );

  // API Mutations
  const enrollMutation = useEnrollInStudyMutation(
    studyId,
    () => {
      // 등록 응답은 본문이 없으므로 모집 방식으로 결과를 안내합니다.
      toast({
        description:
          recruitmentMethod === StudyRecruitmentMethod.FCFS
            ? t("study.application.toast.appliedFcfs")
            : t("study.application.toast.appliedForm"),
      });
      setApplicationText("");
      setIsApplying(false);
      setIsApplicationModalOpen(false);
    },
    (error) => {
      console.error("Enrollment failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("study.application.toast.applyFailed");
      toast({
        description: errorMessage,
      });
      setIsApplying(false);
    }
  );

  // 지원서 수정 뮤테이션
  const updateMutation = useUpdateUserApplicationMutation(
    studyId,
    () => {
      toast({
        description: t("study.application.toast.updated"),
      });
      setIsApplying(false);
      setShouldLoadApplicationDetail(false);
      setIsApplicationModalOpen(false);
    },
    (error) => {
      console.error("Update application failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("study.application.toast.updateFailed");
      toast({
        description: errorMessage,
      });
      setIsApplying(false);
    }
  );

  const handleApply = async () => {
    if (isApplying) return;
    if (recruitmentMethod === StudyRecruitmentMethod.APPLICATION) {
      const trimmedText = applicationText.trim();
      if (!trimmedText) {
        toast({
          description: t("study.application.toast.reasonRequired"),
        });
        return;
      }
    }

    setIsApplying(true);

    const applicationReason =
      recruitmentMethod === StudyRecruitmentMethod.APPLICATION
        ? applicationText.trim()
        : null;

    enrollMutation.mutate({ applicationReason });
  };

  const handleEditApplication = async () => {
    setShouldLoadApplicationDetail(true);
    const result = await refetchApplicationDetail();
    if (result.isError) {
      console.error("Failed to fetch application detail:", result.error);
      toast({
        description: t("study.application.toast.detailLoadFailed"),
      });
      return;
    }
    setEditingApplicationText(result.data?.applicationReason || "");
    setIsApplicationModalOpen(true);
  };

  const handleUpdateApplication = async () => {
    if (isApplying) return;

    const trimmedText = editingApplicationText.trim();
    if (!trimmedText) {
      toast({
        description: t("study.application.toast.reasonRequired"),
      });
      return;
    }

    setIsApplying(true);
    updateMutation.mutate({ applicationReason: trimmedText });
  };

  return {
    applicationText,
    isApplying,
    isApplicationModalOpen,
    userApplicationStatus,
    isStatusLoading,
    isLoadingApplicationDetail,
    editingApplicationText,

    setApplicationText,
    setIsApplicationModalOpen,
    setEditingApplicationText,
    handleApply,
    handleEditApplication,
    handleUpdateApplication,
  };
};
