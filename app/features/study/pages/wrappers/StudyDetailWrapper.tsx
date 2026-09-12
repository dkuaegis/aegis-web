import { useI18n } from "@app/i18n";
import { useNavigate, useParams } from "react-router-dom";
import StudyDetailPage from "../StudyDetailPage";

export default function StudyDetailWrapper() {
  const { t } = useI18n();
  const { studyId } = useParams();
  const numericStudyId = Number(studyId);
  const navigate = useNavigate();

  // studyId가 유효하지 않은 경우 처리
  if (Number.isNaN(numericStudyId)) {
    return <div>{t("study.invalidStudyId")}</div>;
  }

  function handleBack() {
    navigate("/study");
  }

  return (
    <StudyDetailPage
      studyId={numericStudyId}
      onBack={handleBack}
      onEdit={(id) => navigate(`/study/edit/${id}`)}
      onViewApplications={(id) => navigate(`/study/applications/${id}`)}
      onViewMembers={(id) => navigate(`/study/members/${id}`)}
      onManageAttendance={(id) => navigate(`/study/attendance/${id}`)}
    />
  );
}
