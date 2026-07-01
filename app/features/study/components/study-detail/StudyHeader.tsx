import { submitAttendanceCode } from "@study/api/attendanceApi";
import { Badge } from "@study/components/ui/badge";
import { Button } from "@study/components/ui/button";
import { Card, CardHeader, CardTitle } from "@study/components/ui/card";
import { Input } from "@study/components/ui/input";
import { Label } from "@study/components/ui/label";
import { useToast } from "@study/components/ui/useToast";
import {
  ApplicationStatus,
  StudyCategoryLabels,
  type StudyDetail,
  StudyRecruitmentMethod,
  type UserApplicationStatus,
} from "@study/types/study";
import { Settings, UserCheck, Users, UsersIcon } from "lucide-react";
import { useRef, useState } from "react";

interface StudyHeaderProps {
  study: StudyDetail;
  isOwner?: boolean;
  isMember?: boolean;
  userApplicationStatus?: UserApplicationStatus;
  onEdit?: (studyId: number) => void;
  onViewApplications?: (studyId: number) => void;
  onViewMembers?: (studyId: number) => void;
  onManageAttendance?: (studyId: number) => void;
}

export const StudyHeader = ({
  study,
  isOwner = false,
  isMember = false,
  userApplicationStatus,
  onEdit,
  onViewApplications,
  onViewMembers,
  onManageAttendance,
}: StudyHeaderProps) => {
  const [attendanceCode, setAttendanceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const toast = useToast();

  const handleAttendanceCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setAttendanceCode(numericValue);
  };

  const handleAttendanceSubmit = async () => {
    if (submittingRef.current || isSubmitting) return;
    if (attendanceCode.length !== 4) {
      toast({ description: "4자리 숫자 출석코드를 입력해주세요." });
      return;
    }

    setIsSubmitting(true);
    submittingRef.current = true;
    try {
      await submitAttendanceCode(study.id, attendanceCode);
      toast({ description: "출석이 완료되었습니다!" });
      setAttendanceCode(""); // 성공 시 입력 필드 초기화
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "출석 처리 중 오류가 발생했습니다.";
      toast({ description: message });
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const getRecruitmentStatusBadge = () => {
    const isRecruiting =
      study.participantCount < study.maxParticipants ||
      study.maxParticipants === 0;
    return (
      <Badge
        variant="secondary"
        className={`${isRecruiting ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
      >
        {isRecruiting ? "모집중" : "모집완료"}
      </Badge>
    );
  };

  const getApplicationStatusBadge = () => {
    if (isMember) {
      return <Badge className="bg-green-100 text-green-800">참여 중</Badge>;
    }
    switch (userApplicationStatus) {
      case ApplicationStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">신청 대기 중</Badge>
        );
      case ApplicationStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800">신청 거절됨</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6 border-gray-200">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {getRecruitmentStatusBadge()}
              <Badge
                variant="outline"
                className="border-gray-300 text-gray-600"
              >
                #{StudyCategoryLabels[study.category]}
              </Badge>
              {getApplicationStatusBadge()}
            </div>
            <CardTitle className="font-bold text-2xl text-gray-900">
              {study.title}
            </CardTitle>

            {isOwner && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(study.id)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="mr-1 h-4 w-4" />
                  스터디 수정
                </Button>
                {study.recruitmentMethod !== StudyRecruitmentMethod.FCFS && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApplications?.(study.id)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <UsersIcon className="mr-1 h-4 w-4" />
                    스터디 지원현황
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewMembers?.(study.id)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Users className="mr-1 h-4 w-4" />
                  스터디원 관리
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageAttendance?.(study.id)}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  출석 관리
                </Button>
              </div>
            )}
          </div>

          {isMember && !isOwner && (
            <div className="w-full shrink-0 border-gray-200 border-t pt-4 md:w-auto md:border-gray-200 md:border-t-0 md:border-l md:pl-4">
              <div className="flex items-end gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor={`attendance-code-${study.id}`}
                    className="font-medium text-sm"
                  >
                    출석코드
                  </Label>
                  <Input
                    type="text"
                    id={`attendance-code-${study.id}`}
                    placeholder="4자리 숫자"
                    value={attendanceCode}
                    onChange={(e) => handleAttendanceCodeChange(e.target.value)}
                    disabled={isSubmitting}
                    maxLength={4}
                    className="h-9 text-center"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAttendanceSubmit();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleAttendanceSubmit}
                  disabled={isSubmitting || attendanceCode.length !== 4}
                  size="sm"
                  className="h-9"
                >
                  {isSubmitting ? "제출 중..." : "제출"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default StudyHeader;
