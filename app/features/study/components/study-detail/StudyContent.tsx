import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import type { StudyDetail } from "@study/types/study";
import { CheckCircle } from "lucide-react";

interface StudyContentProps {
  study: StudyDetail;
}

export const StudyContent = ({ study }: StudyContentProps) => {
  return (
    <div className="space-y-6 lg:col-span-2">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="font-semibold text-gray-900 text-lg">
            스터디 소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-gray-700 leading-relaxed">
            {study.description}
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="font-semibold text-gray-900 text-lg">
            커리큘럼
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(Array.isArray(study.curricula) ? study.curricula : []).map(
              (item: string) => (
                <div key={item} className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="whitespace-pre-line text-gray-700">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="font-semibold text-gray-900 text-lg">
            지원 자격
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Array.isArray(study.qualifications)
              ? study.qualifications
              : []
            ).map((qualification: string) => (
              <div key={qualification} className="flex items-start">
                <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                <span className="whitespace-pre-line text-gray-700">
                  {qualification}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyContent;
