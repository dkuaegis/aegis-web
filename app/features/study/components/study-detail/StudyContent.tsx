import { useI18n } from "@app/i18n";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import type { StudyDetail } from "@study/types/study";
import { BookOpen, ListChecks } from "lucide-react";
import type { ReactNode } from "react";
import StudyInfo from "./StudyInfo";

function DetailSection({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  const ui = useStudyUiText();
  const lines = items.flatMap((item) =>
    item
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );
  return (
    <section className="paper-card detail-section">
      <header>
        {icon}
        <h2>{title}</h2>
      </header>
      {lines.length ? (
        <ol>
          {lines.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: The API supplies an ordered, read-only list.
            <li key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="muted">
          {ui("등록된 내용이 없습니다.", "No content has been added.")}
        </p>
      )}
    </section>
  );
}
export const StudyContent = ({ study }: { study: StudyDetail }) => {
  const { t } = useI18n();
  return (
    <div className="study-detail-content">
      {study.description && (
        <section className="paper-card study-description">
          <h2>{t("study.detail.about")}</h2>
          <p>{study.description}</p>
        </section>
      )}
      <StudyInfo study={study} />
      <DetailSection
        icon={<BookOpen aria-hidden="true" />}
        title={t("study.detail.curriculum")}
        items={Array.isArray(study.curricula) ? study.curricula : []}
      />
      <DetailSection
        icon={<ListChecks aria-hidden="true" />}
        title={t("study.detail.qualifications")}
        items={Array.isArray(study.qualifications) ? study.qualifications : []}
      />
    </div>
  );
};
export default StudyContent;
