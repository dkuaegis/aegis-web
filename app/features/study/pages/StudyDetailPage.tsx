import { useI18n } from "@app/i18n";
import { useStudyDetailQuery } from "@study/api/studyDetailApi";
import ApplicationSection from "@study/components/study-detail/ApplicationSection";
import StudyContent from "@study/components/study-detail/StudyContent";
import StudyHeader from "@study/components/study-detail/StudyHeader";
import StudyLayout, {
  StudyEmpty,
  StudyError,
  StudyLoading,
  useStudyUiText,
} from "@study/components/ui/StudyLayout";
import { useStudyApplication } from "@study/hooks/useStudyUserApplication";
import { useUserRole } from "@study/hooks/useUserRole";
import {
  StudyRecruitmentMethod,
  studyCategoryLabelKey,
  studyLevelLabelKey,
} from "@study/types/study";
import { Edit3 } from "lucide-react";

interface StudyDetailProps {
  studyId: number;
  onBack?: () => void;
  onEdit?: (studyId: number) => void;
  onViewApplications?: (studyId: number) => void;
  onViewMembers?: (studyId: number) => void;
  onManageAttendance?: (studyId: number) => void;
}

const StudyDetailPage = ({
  studyId,
  onBack,
  onEdit,
  onViewApplications,
  onViewMembers,
  onManageAttendance,
}: StudyDetailProps) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const {
    isInstructor,
    isParticipant,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  const {
    data: study,
    isLoading: isStudyLoading,
    isError,
    error,
  } = useStudyDetailQuery(studyId, { enabled: !isRoleLoading });

  const {
    applicationText,
    isApplying,
    isApplicationModalOpen,
    userApplicationStatus,
    setApplicationText,
    setIsApplicationModalOpen,
    handleApply,
    handleEditApplication,
    handleUpdateApplication,
    isLoadingApplicationDetail,
    editingApplicationText,
    setEditingApplicationText,
  } = useStudyApplication({
    studyId: studyId,
    recruitmentMethod: study?.recruitmentMethod ?? StudyRecruitmentMethod.FCFS,
  });

  const isLoading = isStudyLoading || isRoleLoading;

  if (isLoading) {
    return (
      <StudyLayout>
        <StudyLoading
          label={
            isRoleLoading ? t("study.loading.role") : t("study.loading.study")
          }
        />
      </StudyLayout>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
  }

  if (isError) {
    return (
      <StudyLayout onBack={onBack}>
        <StudyError
          message={error?.message ?? t("study.detail.genericError")}
        />
      </StudyLayout>
    );
  }
  if (!study) {
    return (
      <StudyLayout onBack={onBack}>
        <StudyEmpty title={t("study.detail.notFound")} />
      </StudyLayout>
    );
  }

  const isOwner = isInstructor(studyId);
  const isMember = isParticipant(studyId);

  return (
    <StudyLayout
      wide
      onBack={onBack}
      backLabel={ui("스터디 목록", "Study list")}
      meta={`${t(studyCategoryLabelKey(study.category))} · ${t(studyLevelLabelKey(study.level))}`}
      title={study.title}
      actions={
        isOwner ? (
          <button
            className="button button-outline"
            type="button"
            onClick={() => onEdit?.(study.id)}
          >
            <Edit3 aria-hidden="true" /> {ui("정보 수정", "Edit information")}
          </button>
        ) : undefined
      }
    >
      <div className="study-detail-layout">
        <StudyContent study={study} />
        <aside className="study-side-panel paper-card">
          <StudyHeader
            study={study}
            isOwner={isOwner}
            isMember={isMember}
            userApplicationStatus={userApplicationStatus}
            onViewApplications={onViewApplications}
            onViewMembers={onViewMembers}
            onManageAttendance={onManageAttendance}
          />
          {!isOwner && !isMember && (
            <ApplicationSection
              study={study}
              isOwner={isOwner}
              isMember={isMember}
              applicationState={{
                applicationText,
                isApplying,
                isApplicationModalOpen,
                userApplicationStatus,
                setApplicationText,
                setIsApplicationModalOpen,
                handleApply,
                handleEditApplication,
                handleUpdateApplication,
                isLoadingApplicationDetail,
                editingApplicationText,
                setEditingApplicationText,
              }}
            />
          )}
        </aside>
      </div>
    </StudyLayout>
  );
};

export default StudyDetailPage;
