import { useI18n } from "@app/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import { Label } from "@study/components/ui/label";
import { Separator } from "@study/components/ui/separator";
import type { StudyDetail } from "@study/types/study";
import { getRecruitmentMethodText } from "@study/utils/studyStatusHelpers";

interface StudyInfoProps {
  study: StudyDetail;
}

export const StudyInfo = ({ study }: StudyInfoProps) => {
  const { t } = useI18n();

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {t("study.detail.info")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-medium text-gray-900 text-sm">
            {t("study.detail.instructor")}
          </Label>
          <p className="mt-1 text-gray-700">{study.instructor}</p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">
            {t("study.detail.recruitmentMethod")}
          </Label>
          <p className="mt-1 text-gray-700">
            {getRecruitmentMethodText(study.recruitmentMethod)}
          </p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">
            {t("study.detail.participantLimit")}
          </Label>
          <p className="mt-1 text-gray-700">
            {study.maxParticipants === 0
              ? t("study.list.noLimit")
              : t("study.list.participants", {
                  current: study.participantCount,
                  max: study.maxParticipants,
                })}
          </p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">
            {t("study.detail.schedule")}
          </Label>
          <p className="mt-1 text-gray-700">{study.schedule}</p>
        </div>

        <Separator className="bg-gray-200" />
      </CardContent>
    </Card>
  );
};

export default StudyInfo;
