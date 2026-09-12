import { t } from "@app/i18n/store";
import {
  type StudyDetail,
  StudyRecruitmentMethod,
  studyRecruitmentMethodLongLabelKey,
} from "@study/types/study";

export const getRecruitmentMethodText = (
  method: StudyRecruitmentMethod
): string => t(studyRecruitmentMethodLongLabelKey(method));

export const getApplicationSectionTitle = (
  status: "APPROVED" | "PENDING" | "REJECTED" | null,
  recruitmentMethod: StudyRecruitmentMethod
): string => {
  switch (status) {
    case "PENDING":
      return t("study.application.sectionTitle.pending");
    case "APPROVED":
      return t("study.application.sectionTitle.approved");
    case "REJECTED":
      return t("study.application.sectionTitle.rejected");
    default:
      return recruitmentMethod === StudyRecruitmentMethod.FCFS
        ? t("study.application.sectionTitle.applyFcfs")
        : t("study.application.sectionTitle.applyForm");
  }
};

export const isStudyRecruiting = (study: StudyDetail): boolean => {
  return (
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0
  );
};
