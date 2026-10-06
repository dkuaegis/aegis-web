import { useI18n } from "@app/i18n";
import { submitAttendanceCode } from "@study/api/attendanceApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@study/components/ui/dialog";
import { Input } from "@study/components/ui/input";
import { Label } from "@study/components/ui/label";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import { useToast } from "@study/components/ui/useToast";
import {
  type StudyDetail,
  StudyRecruitmentMethod,
  type UserApplicationStatus,
} from "@study/types/study";
import { ClipboardCheck, ListChecks, Users } from "lucide-react";
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
  onViewApplications,
  onViewMembers,
  onManageAttendance,
}: StudyHeaderProps) => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const [attendanceCode, setAttendanceCode] = useState("");
  const [attendanceOpen, setAttendanceOpen] = useState(false);
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
      toast({ description: t("study.detail.attendance.invalidLength") });
      return;
    }

    setIsSubmitting(true);
    submittingRef.current = true;
    try {
      await submitAttendanceCode(study.id, attendanceCode);
      toast({ description: t("study.detail.attendance.success") });
      setAttendanceCode(""); // 성공 시 입력 필드 초기화
      setAttendanceOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("study.detail.attendance.failure");
      toast({ description: message });
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  if (isOwner) {
    return (
      <>
        <span className="tag tag-coral">{ui("스터디장", "Instructor")}</span>
        <h2>{ui("스터디 관리", "Manage study")}</h2>
        <p>
          {ui(
            "지원자, 스터디원과 출석 현황을 한곳에서 관리하세요.",
            "Manage applications, members and attendance in one place."
          )}
        </p>
        {study.recruitmentMethod !== StudyRecruitmentMethod.FCFS && (
          <button
            className="button button-primary button-full"
            type="button"
            onClick={() => onViewApplications?.(study.id)}
          >
            <ListChecks aria-hidden="true" />{" "}
            {ui("지원자 관리", "Manage applications")}
          </button>
        )}
        <button
          className="button button-outline button-full"
          type="button"
          onClick={() => onViewMembers?.(study.id)}
        >
          <Users aria-hidden="true" /> {ui("스터디원", "Members")}
        </button>
        <button
          className="button button-outline button-full"
          type="button"
          onClick={() => onManageAttendance?.(study.id)}
        >
          <ClipboardCheck aria-hidden="true" />{" "}
          {t("study.detail.ownerActions.attendance")}
        </button>
      </>
    );
  }
  if (!isMember) return null;
  return (
    <>
      <span className="tag tag-blue">
        {t("study.detail.badges.participating")}
      </span>
      <h2>{ui("오늘도 함께해요.", "Let's study together.")}</h2>
      <p>
        {ui(
          "스터디장이 알려준 4자리 코드를 입력해 출석하세요.",
          "Enter the four-digit code from your instructor to mark attendance."
        )}
      </p>
      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogTrigger asChild>
          <button className="button button-primary button-full" type="button">
            <ClipboardCheck aria-hidden="true" />{" "}
            {ui("출석 코드 입력", "Enter attendance code")}
          </button>
        </DialogTrigger>
        <DialogContent className="study-attendance-modal">
          <DialogHeader>
            <DialogTitle>
              {ui("출석 코드 입력", "Enter attendance code")}
            </DialogTitle>
            <DialogDescription>
              {ui(
                "스터디장이 알려준 4자리 숫자를 입력해 주세요.",
                "Enter the four-digit code from your instructor."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="attendance-code-form">
            <Label htmlFor={`attendance-code-${study.id}`}>
              {t("study.detail.attendance.label")}
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              id={`attendance-code-${study.id}`}
              placeholder={t("study.detail.attendance.placeholder")}
              value={attendanceCode}
              onChange={(e) => handleAttendanceCodeChange(e.target.value)}
              disabled={isSubmitting}
              maxLength={4}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAttendanceSubmit();
              }}
            />
            <button
              className="button button-primary button-full"
              type="button"
              onClick={handleAttendanceSubmit}
              disabled={isSubmitting || attendanceCode.length !== 4}
            >
              {isSubmitting
                ? t("study.detail.attendance.submitting")
                : t("study.detail.attendance.submit")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default StudyHeader;
