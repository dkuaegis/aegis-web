import { useI18n } from "@app/i18n";
import { useStudyListQuery } from "@study/api/studyListApi";
import StudyLayout, {
  StudyEmpty,
  StudyError,
  StudyLoading,
  useStudyUiText,
} from "@study/components/ui/StudyLayout";
import { useUserRole } from "@study/hooks/useUserRole";
import {
  type StudyListItem,
  studyCategoryLabelKey,
  studyLevelLabelKey,
} from "@study/types/study";
import { CalendarDays, Plus, Users } from "lucide-react";
import { memo } from "react";

interface StudyCardProps {
  study: StudyListItem;
  role?: string;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyCard = memo(({ study, role, onViewStudyDetail }: StudyCardProps) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const isOpen =
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0;
  return (
    <button
      className="study-card"
      type="button"
      onClick={() => onViewStudyDetail(study.id)}
      aria-label={study.title}
    >
      <div className="study-card-main">
        <div className="study-card-meta">
          <span className={isOpen ? "tag tag-blue" : "tag"}>
            {isOpen ? ui("모집 중", "Recruiting") : ui("모집 완료", "Closed")}
          </span>
          <span className="tag tag-category">
            {t(studyCategoryLabelKey(study.category))}
          </span>
          <span className="tag">{t(studyLevelLabelKey(study.level))}</span>
          {role && <span className="tag tag-coral">{role}</span>}
        </div>
        <h2>{study.title}</h2>
      </div>
      <dl>
        <div>
          <dt>
            <CalendarDays aria-hidden="true" />
          </dt>
          <dd>{study.schedule}</dd>
        </div>
        <div>
          <dt>
            <Users aria-hidden="true" />
          </dt>
          <dd>
            {study.maxParticipants === 0
              ? ui("무제한", "Unlimited")
              : t("study.list.participants", {
                  current: study.participantCount,
                  max: study.maxParticipants,
                })}{" "}
            · {study.instructor}
          </dd>
        </div>
      </dl>
      <span className="card-link">{ui("자세히 보기 →", "View details →")}</span>
    </button>
  );
});
StudyCard.displayName = "StudyCard";

interface StudyListMainProps {
  onCreateStudy: () => void;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyList = ({
  onCreateStudy,
  onViewStudyDetail,
}: StudyListMainProps) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const { data: studies = [], isLoading: loading, error } = useStudyListQuery();
  const { isInstructor, isParticipant, isApplicant } = useUserRole();
  return (
    <StudyLayout wide>
      <header className="study-list-heading">
        <h1>{ui("스터디", "Studies")}</h1>
        <button
          className="button button-primary"
          type="button"
          onClick={onCreateStudy}
        >
          <Plus aria-hidden="true" /> {ui("스터디 개설", "Create study")}
        </button>
      </header>
      {loading ? (
        <StudyLoading label={ui("스터디를 불러오는 중", "Loading studies")} />
      ) : error ? (
        <StudyError message={t("study.list.loadError")} />
      ) : studies.length === 0 ? (
        <StudyEmpty
          title={ui(
            "아직 개설된 스터디가 없습니다.",
            "There are no studies yet."
          )}
          description={ui(
            "첫 스터디를 개설해 보세요.",
            "Create the first study."
          )}
        />
      ) : (
        <div className="study-list">
          {studies.map((study) => (
            <StudyCard
              key={study.id}
              study={study}
              role={
                isInstructor(study.id)
                  ? ui("스터디장", "Instructor")
                  : isParticipant(study.id)
                    ? ui("참여 중", "Participating")
                    : isApplicant(study.id)
                      ? ui("지원함", "Applied")
                      : undefined
              }
              onViewStudyDetail={onViewStudyDetail}
            />
          ))}
        </div>
      )}
    </StudyLayout>
  );
};
export default StudyList;
