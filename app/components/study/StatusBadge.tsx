import type { StudyApplicationStatus } from "@app/api/generated/model";
import { Badge } from "@app/components/ui/badge";
import { useI18n } from "@app/i18n";
import { APPLICATION_STATUS_TONE } from "./study";

export function StatusBadge({ status }: { status: StudyApplicationStatus }) {
  const { t } = useI18n();
  return (
    <Badge tone={APPLICATION_STATUS_TONE[status]}>
      {t(`study.labels.applicationStatus.${status}`)}
    </Badge>
  );
}
