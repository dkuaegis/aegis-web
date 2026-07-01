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
import { useEffect, useRef, useState } from "react";

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
  const [userApplicationStatus, setUserApplicationStatus] =
    useState<UserApplicationStatus>(null);
  const [shouldLoadApplicationDetail, setShouldLoadApplicationDetail] =
    useState(false);

  const [editingApplicationText, setEditingApplicationText] = useState("");

  const lastKnownStatusRef = useRef<"APPROVED" | "PENDING" | "REJECTED" | null>(
    null
  );

  const toast = useToast();

  // 사용자 역할 훅
  const { hasApplied, isLoading: isRoleLoading } = useUserRole();

  // 선착순(FCFS)인 경우 서버의 /status 호출을 하지 않고
  // 사용자 역할로 참여 여부를 판별한다. 이때 role 로딩 중이면 대기.
  const shouldFetchStatus = recruitmentMethod !== StudyRecruitmentMethod.FCFS;

  const statusQueryEnabled = shouldFetchStatus && !isRoleLoading;
  const { data: statusData } = useStudyStatusQuery(studyId, statusQueryEnabled);

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

  // 상태 데이터가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    // FCFS(선착순)인 경우에는 서버 status 대신 user role로 참여 여부 판단
    if (recruitmentMethod === StudyRecruitmentMethod.FCFS) {
      // role 정보가 아직 로드되지 않았다면 대기
      if (isRoleLoading) return;
      const applied = hasApplied(studyId);
      const safeStatus = applied ? ApplicationStatus.APPROVED : null;
      setUserApplicationStatus(safeStatus);
      lastKnownStatusRef.current = safeStatus;
      return;
    }

    const raw = statusData?.status;
    if (typeof raw === "string") {
      // API 상태를 로컬 상태 형식으로 안전하게 변환 (대문자 처리)
      const normalized = raw.toUpperCase();
      const allowed =
        normalized === ApplicationStatus.APPROVED ||
        normalized === ApplicationStatus.PENDING ||
        normalized === ApplicationStatus.REJECTED;
      const safeStatus = allowed ? (normalized as ApplicationStatus) : null;
      setUserApplicationStatus(safeStatus);
      lastKnownStatusRef.current = safeStatus;
    } else {
      // statusData가 null/undefined이거나 형태가 예상과 다름
      setUserApplicationStatus(null);
      lastKnownStatusRef.current = null;
    }
  }, [statusData, recruitmentMethod, isRoleLoading, hasApplied, studyId]);

  // API Mutations
  const enrollMutation = useEnrollInStudyMutation(
    studyId,
    (data) => {
      // 성공 콜백 - 상태는 쿼리에서 자동으로 업데이트됨
      if (data.status === "APPROVED") {
        toast({
          description: "지원이 완료되었습니다! 스터디에 참여하게 되었습니다.",
        });
      } else {
        toast({
          description:
            "지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.",
        });
      }
      setApplicationText("");
      setIsApplying(false);
      setIsApplicationModalOpen(false);
    },
    (error) => {
      console.error("Enrollment failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "지원 중 오류가 발생했습니다. 다시 시도해주세요.";
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
        description: "지원서가 성공적으로 수정되었습니다.",
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
          : "지원서 수정 중 오류가 발생했습니다. 다시 시도해주세요.";
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
          description: "지원 사유를 입력해주세요.",
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
    try {
      const result = await refetchApplicationDetail();
      setEditingApplicationText(result.data?.applicationReason || "");
      setIsApplicationModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch application detail:", error);
      toast({
        description: "지원서 정보를 불러오는데 실패했습니다.",
      });
    }
  };

  const handleUpdateApplication = async () => {
    if (isApplying) return;

    const trimmedText = editingApplicationText.trim();
    if (!trimmedText) {
      toast({
        description: "지원 사유를 입력해주세요.",
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
