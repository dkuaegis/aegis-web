import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import type { ApplicationState } from "@study/types/application";
import { type StudyDetail, StudyRecruitmentMethod } from "@study/types/study";
import {
  getApplicationSectionTitle,
  isStudyRecruiting,
} from "@study/utils/studyStatusHelpers";
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

  if (isOwner) {
    return null;
  }

  const cardTitle = getApplicationSectionTitle(
    userApplicationStatus,
    study.recruitmentMethod
  );

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
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="font-semibold text-gray-900 text-lg">
            {cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{renderContent()}</CardContent>
      </Card>
    </ApplicationStateContext.Provider>
  );
};

export default ApplicationSection;

const StatusMessage = ({ type }: { type: "APPROVED" | "REJECTED" }) => {
  const config = {
    APPROVED: {
      text: "스터디에 참여 중입니다!",
      textColor: "text-green-600",
      subText: null,
    },
    REJECTED: {
      text: "신청이 거절되었습니다.",
      textColor: "text-red-600",
      subText: "다른 스터디를 찾아보세요.",
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
