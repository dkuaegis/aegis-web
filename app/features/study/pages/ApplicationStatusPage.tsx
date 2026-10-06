import { useI18n } from "@app/i18n";
import ApplicationCard from "@study/components/study/ApplicationCard";
import StudyLayout, {
  StudyEmpty,
  StudyError,
  StudyLoading,
  useStudyUiText,
} from "@study/components/ui/StudyLayout";
import { useApplications } from "@study/hooks/useOwnerApplications";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import { ApplicationStatus, StudyRecruitmentMethod } from "@study/types/study";

interface ApplicationStatusProps {
  studyId: number;
  onBack: () => void;
}

const ApplicationStatusPage = ({ studyId, onBack }: ApplicationStatusProps) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const {
    isInstructor,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  const {
    selectedFilter,
    setSelectedFilter,
    studyInfo,
    handleStatusChange,
    stats,
    filteredApplications,
    loading,
    error,
  } = useApplications(studyId);

  const isLoading = loading || isRoleLoading;
  const isOwner = isInstructor(studyId);

  if (isLoading)
    return (
      <StudyLayout onBack={onBack}>
        <StudyLoading
          label={
            isRoleLoading
              ? t("study.loading.role")
              : t("study.loading.applicants")
          }
        />
      </StudyLayout>
    );
  if (roleError) console.error("사용자 권한 조회 오류:", roleError);
  if (!isOwner)
    return (
      <ForbiddenPage
        message={t("study.forbidden.applications")}
        onBack={onBack}
      />
    );
  if (studyInfo?.recruitmentMethod === StudyRecruitmentMethod.FCFS)
    return (
      <StudyLayout onBack={onBack}>
        <StudyEmpty
          title={t("study.applications.fcfsTitle")}
          description={t("study.applications.fcfsSubtitle")}
        />
      </StudyLayout>
    );
  if (error)
    return (
      <StudyLayout onBack={onBack}>
        <StudyError message={error} />
        <button
          className="button button-primary"
          type="button"
          onClick={() => window.location.reload()}
        >
          {t("common.retry")}
        </button>
      </StudyLayout>
    );
  if (!studyInfo)
    return (
      <StudyLayout onBack={onBack}>
        <StudyEmpty title={t("study.applications.noApplicants")} />
      </StudyLayout>
    );
  const filterOptions = [
    {
      key: "ALL" as const,
      label: t("study.applications.filters.all"),
      count: stats.total,
    },
    {
      key: ApplicationStatus.PENDING,
      label: t("study.applications.filters.pending"),
      count: stats.pending,
    },
    {
      key: ApplicationStatus.APPROVED,
      label: t("study.applications.filters.approved"),
      count: stats.approved,
    },
    {
      key: ApplicationStatus.REJECTED,
      label: t("study.applications.filters.rejected"),
      count: stats.rejected,
    },
  ];
  return (
    <StudyLayout
      wide
      onBack={onBack}
      title={ui("지원자 관리", "Manage applications")}
    >
      <div className="filter-chips application-filters">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            className={selectedFilter === option.key ? "is-active" : ""}
            aria-pressed={selectedFilter === option.key}
            onClick={() => setSelectedFilter(option.key)}
          >
            {option.label} {option.count}
          </button>
        ))}
      </div>
      {filteredApplications.length === 0 ? (
        <StudyEmpty
          title={ui(
            "해당 상태의 지원자가 없습니다.",
            "No applications match this status."
          )}
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{ui("이름", "Name")}</th>
                <th scope="col">{ui("학번", "Student ID")}</th>
                <th scope="col">{ui("연락처", "Contact")}</th>
                <th scope="col">{ui("지원일", "Applied")}</th>
                <th scope="col">{ui("상태", "Status")}</th>
                <th scope="col">
                  <span className="visually-hidden">
                    {t("study.applications.card.viewApplication")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onStatusChange={handleStatusChange}
                  recruitmentMethod={studyInfo.recruitmentMethod}
                  studyId={studyId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudyLayout>
  );
};
export default ApplicationStatusPage;
