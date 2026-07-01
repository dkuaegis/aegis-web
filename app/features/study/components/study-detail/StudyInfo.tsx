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
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          스터디 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-medium text-gray-900 text-sm">스터디장</Label>
          <p className="mt-1 text-gray-700">{study.instructor}</p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">모집 방법</Label>
          <p className="mt-1 text-gray-700">
            {getRecruitmentMethodText(study.recruitmentMethod)}
          </p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">제한 인원</Label>
          <p className="mt-1 text-gray-700">
            {study.maxParticipants === 0
              ? "제한 없음"
              : `${study.participantCount}/${study.maxParticipants}명`}
          </p>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <Label className="font-medium text-gray-900 text-sm">일정</Label>
          <p className="mt-1 text-gray-700">{study.schedule}</p>
        </div>

        <Separator className="bg-gray-200" />
      </CardContent>
    </Card>
  );
};

export default StudyInfo;
