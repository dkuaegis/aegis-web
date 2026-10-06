import { useI18n } from "@app/i18n";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import {
  type StudyDetail,
  studyRecruitmentMethodLabelKey,
} from "@study/types/study";

export const StudyInfo = ({ study }: { study: StudyDetail }) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  return (
    <section className="paper-card study-overview">
      <dl>
        <div>
          <dt>{t("study.detail.instructor")}</dt>
          <dd>{study.instructor}</dd>
        </div>
        <div>
          <dt>{t("study.detail.schedule")}</dt>
          <dd>{study.schedule}</dd>
        </div>
        <div>
          <dt>{ui("모집 방식", "Recruitment method")}</dt>
          <dd>{t(studyRecruitmentMethodLabelKey(study.recruitmentMethod))}</dd>
        </div>
        <div>
          <dt>{ui("참여 인원", "Participants")}</dt>
          <dd>
            {study.participantCount} /{" "}
            {study.maxParticipants === 0
              ? ui("무제한", "Unlimited")
              : study.maxParticipants}
            {ui("명", "")}
          </dd>
        </div>
      </dl>
    </section>
  );
};
export default StudyInfo;
