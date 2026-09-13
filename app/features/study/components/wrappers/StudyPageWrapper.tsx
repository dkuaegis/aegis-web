import { useI18n } from "@app/i18n";
import { useNavigate, useParams } from "react-router-dom";

type StudyPageWrapperProps = {
  PageComponent: React.ComponentType<{ studyId: number; onBack: () => void }>;
};

function StudyPageWrapper({ PageComponent }: StudyPageWrapperProps) {
  const { t } = useI18n();
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const numericStudyId = Number(studyId);
  if (Number.isNaN(numericStudyId)) {
    return <div>{t("study.invalidStudyId")}</div>;
  }
  return (
    <PageComponent
      studyId={numericStudyId}
      onBack={() => navigate(`/study/detail/${studyId}`)}
    />
  );
}

export default StudyPageWrapper;
