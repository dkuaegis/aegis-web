import { type StudyDetail, StudyRecruitmentMethod } from "@study/types/study";

export const getRecruitmentMethodText = (
  method: StudyRecruitmentMethod
): string => {
  return method === StudyRecruitmentMethod.FCFS ? "선착순 모집" : "지원서 심사";
};

export const getApplicationSectionTitle = (
  status: "APPROVED" | "PENDING" | "REJECTED" | null,
  recruitmentMethod: StudyRecruitmentMethod
): string => {
  switch (status) {
    case "PENDING":
      return "신청 현황";
    case "APPROVED":
      return "참여 현황";
    case "REJECTED":
      return "신청 결과";
    default:
      return recruitmentMethod === StudyRecruitmentMethod.FCFS
        ? "지원하기"
        : "지원서 작성";
  }
};

export const isStudyRecruiting = (study: StudyDetail): boolean => {
  return (
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0
  );
};
