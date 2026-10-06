import { useI18n } from "@app/i18n";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import type { ApplicationState } from "@study/types/application";
import { type StudyDetail, StudyRecruitmentMethod } from "@study/types/study";
import { isStudyRecruiting } from "@study/utils/studyStatusHelpers";
import ApplicationForm from "./ApplicationForm";
import ApplicationStateContext from "./ApplicationStateContext";
import FirstComeForm from "./FirstComeForm";
import PendingApplicationStatus from "./PendingApplicationStatus";

interface ApplicationSectionProps {
  study: StudyDetail;
  isOwner?: boolean;
  isMember?: boolean;
  applicationState: ApplicationState;
}

export const ApplicationSection = ({
  study,
  isOwner = false,
  isMember = false,
  applicationState,
}: ApplicationSectionProps) => {
  const { userApplicationStatus } = applicationState;
  const ui = useStudyUiText();

  if (isOwner) {
    return null;
  }

  const recruiting = isStudyRecruiting(study);
  const cardTitle =
    userApplicationStatus === "PENDING" || userApplicationStatus === "REJECTED"
      ? ui("지원 현황", "Application status")
      : recruiting
        ? ui("이 스터디와 함께할까요?", "Join this study?")
        : ui("모집이 마감되었습니다.", "Recruitment has closed.");

  const renderApplicationForm = () => {
    const recruiting = isStudyRecruiting(study);
    if (study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION) {
      return <ApplicationForm recruiting={recruiting} />;
    } else {
      return <FirstComeForm recruiting={recruiting} />;
    }
  };

  const renderContent = () => {
    if (isMember) {
      return <StatusMessage type="APPROVED" />;
    }
    switch (userApplicationStatus) {
      case "PENDING":
        return <PendingApplicationStatus study={study} />;
      case "REJECTED":
        return <StatusMessage type="REJECTED" />;
      default:
        return renderApplicationForm();
    }
  };

  return (
    <ApplicationStateContext.Provider value={applicationState}>
      {userApplicationStatus && (
        <span
          className={`status-chip status-${userApplicationStatus.toLowerCase()}`}
        >
          {userApplicationStatus === "PENDING"
            ? ui("검토 중", "Pending")
            : userApplicationStatus === "REJECTED"
              ? ui("거절", "Rejected")
              : ui("승인", "Approved")}
        </span>
      )}
      <h2>{cardTitle}</h2>
      {renderContent()}
    </ApplicationStateContext.Provider>
  );
};

export default ApplicationSection;

const StatusMessage = ({ type }: { type: "APPROVED" | "REJECTED" }) => {
  const { t } = useI18n();
  const config = {
    APPROVED: {
      text: t("study.application.statusMessage.approved"),
      textColor: "text-green-600",
      subText: null,
    },
    REJECTED: {
      text: t("study.application.statusMessage.rejected"),
      textColor: "text-red-600",
      subText: t("study.application.statusMessage.rejectedSub"),
    },
  };
  const { text, textColor, subText } = config[type];

  return (
    <div className="space-y-4 text-center">
      <p className={`mb-2 font-medium ${textColor}`}>{text}</p>
      {subText && <p className="text-gray-500 text-sm">{subText}</p>}
    </div>
  );
};
