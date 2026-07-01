import { useStudyDetailQuery } from "@study/api/studyDetailApi";
import ApplicationSection from "@study/components/study-detail/ApplicationSection";
import StudyContent from "@study/components/study-detail/StudyContent";
import StudyHeader from "@study/components/study-detail/StudyHeader";
import StudyInfo from "@study/components/study-detail/StudyInfo";
import Header from "@study/components/ui/Header";
import { useStudyApplication } from "@study/hooks/useStudyUserApplication";
import { useUserRole } from "@study/hooks/useUserRole";
import { StudyRecruitmentMethod } from "@study/types/study";

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">
          {isRoleLoading
            ? "권한 정보를 불러오는 중..."
            : "스터디 정보를 불러오는 중..."}
        </div>
      </div>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-500">
          {error?.message ?? "오류가 발생했습니다."}
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">스터디를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const isOwner = isInstructor(studyId);
  const isMember = isParticipant(studyId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={onBack} />

      <div className="mx-auto max-w-4xl p-6">
        <StudyHeader
          study={study}
          isOwner={isOwner}
          isMember={isMember}
          userApplicationStatus={userApplicationStatus}
          onEdit={onEdit}
          onViewApplications={onViewApplications}
          onViewMembers={onViewMembers}
          onManageAttendance={onManageAttendance}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StudyContent study={study} />

          <div className="space-y-6">
            <StudyInfo study={study} />

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetailPage;
