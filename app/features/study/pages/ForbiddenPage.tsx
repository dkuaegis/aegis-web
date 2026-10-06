import { useI18n } from "@app/i18n";
import StudyLayout, { StudyError } from "@study/components/ui/StudyLayout";

interface ForbiddenPageProps {
  message?: string;
  onBack?: (() => void) | undefined;
}
const ForbiddenPage = ({ message, onBack }: ForbiddenPageProps) => {
  const { t } = useI18n();
  return (
    <StudyLayout onBack={onBack}>
      <StudyError message={message ?? t("study.forbidden.default")} />
    </StudyLayout>
  );
};
export default ForbiddenPage;
