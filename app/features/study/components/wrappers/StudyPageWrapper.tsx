import { useNavigate, useParams } from "react-router-dom";

type StudyPageWrapperProps = {
  PageComponent: React.ComponentType<{ studyId: number; onBack: () => void }>;
};

function StudyPageWrapper({ PageComponent }: StudyPageWrapperProps) {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const numericStudyId = Number(studyId);
  if (Number.isNaN(numericStudyId)) {
    return <div>유효하지 않은 스터디 ID입니다.</div>;
  }
  return (
    <PageComponent
      studyId={numericStudyId}
      onBack={() => navigate(`/study/detail/${studyId}`)}
    />
  );
}

export default StudyPageWrapper;
