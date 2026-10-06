import { useI18n } from "@app/i18n";
import type {
  AttendanceCodeResponse,
  AttendanceInstructorResponse,
} from "@study/api/attendanceApi";
import {
  fetchAttendanceCode,
  fetchAttendanceInstructor,
} from "@study/api/attendanceApi";
import StudyConfirmationDialog from "@study/components/study/StudyConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@study/components/ui/dialog";
import StudyLayout, {
  StudyEmpty,
  StudyError,
  StudyLoading,
  useStudyUiText,
} from "@study/components/ui/StudyLayout";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import { Check, Copy, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AttendanceProps {
  studyId: number;
  onBack: (id: number) => void;
}

const AttendancePage = ({ studyId, onBack }: AttendanceProps) => {
  const { t, language } = useI18n();
  const ui = useStudyUiText();
  const {
    isInstructor,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  const [isGenerating, setIsGenerating] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState<string>("");
  const [attendanceData, setAttendanceData] =
    useState<AttendanceInstructorResponse | null>(null);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const toast = useToast();
  const inFlight = useRef(false);

  const isOwner = isInstructor(studyId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Keep the existing fetch lifecycle; t only supplies fallback error copy.
  useEffect(() => {
    if (isRoleLoading) return;
    if (!isOwner) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchData = async () => {
      setIsLoadingAttendance(true);
      try {
        const data = await fetchAttendanceInstructor(
          studyId,
          controller.signal
        );
        if (cancelled) return;
        setAttendanceData(data);
        setAttendanceError(null);
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : t("study.attendance.loadError");
        setAttendanceError(message);
        toast({ description: message });
      } finally {
        if (!cancelled) setIsLoadingAttendance(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [studyId, isOwner, isRoleLoading, toast]);

  if (isRoleLoading)
    return (
      <StudyLayout onBack={() => onBack(studyId)}>
        <StudyLoading label={t("study.loading.role")} />
      </StudyLayout>
    );
  if (roleError) console.error("사용자 권한 조회 오류:", roleError);
  if (!isOwner)
    return (
      <ForbiddenPage
        message={t("study.forbidden.attendance")}
        onBack={() => onBack(studyId)}
      />
    );
  if (isLoadingAttendance)
    return (
      <StudyLayout onBack={() => onBack(studyId)}>
        <StudyLoading label={t("study.loading.attendance")} />
      </StudyLayout>
    );
  if (attendanceError)
    return (
      <StudyLayout onBack={() => onBack(studyId)}>
        <StudyError message={attendanceError} />
      </StudyLayout>
    );
  if (!attendanceData)
    return (
      <StudyLayout onBack={() => onBack(studyId)}>
        <StudyEmpty title={t("study.attendance.noData")} />
      </StudyLayout>
    );
  const { sessions, members } = attendanceData;

  const generateAttendanceCode = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsGenerating(true);
    try {
      const res: AttendanceCodeResponse = await fetchAttendanceCode(studyId);
      setAttendanceCode(res.code);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("study.attendance.codeError");
      toast({ description: message });
    } finally {
      inFlight.current = false;
      setIsGenerating(false);
    }
  };

  return (
    <StudyLayout
      wide
      onBack={() => onBack(studyId)}
      title={ui("출석 관리", "Attendance management")}
      actions={
        <StudyConfirmationDialog
          onConfirm={generateAttendanceCode}
          isSubmitting={isGenerating}
          submitText={t("study.attendance.generateShort")}
          submittingText={t("study.attendance.generating")}
          title={t("study.attendance.generateConfirmTitle")}
          description={t("study.attendance.generateConfirmDescription")}
        >
          <button
            className="button button-primary"
            type="button"
            disabled={isGenerating}
          >
            <Send aria-hidden="true" />{" "}
            {isGenerating
              ? ui("발급 중...", "Issuing...")
              : ui("오늘 출석 코드 발급", "Issue today's attendance code")}
          </button>
        </StudyConfirmationDialog>
      }
    >
      {sessions.length === 0 ? (
        <StudyEmpty
          title={ui(
            "아직 출석 회차가 없습니다.",
            "There are no attendance sessions yet."
          )}
          description={ui(
            "오늘 출석 코드를 발급하면 첫 회차가 생성됩니다.",
            "Issue today's attendance code to create the first session."
          )}
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table attendance-table">
            <thead>
              <tr>
                <th scope="col">{ui("스터디원", "Member")}</th>
                {sessions.map((session, index) => (
                  <th scope="col" key={session.sessionId}>
                    <span>
                      {t("study.attendance.sessionColumn", {
                        index: index + 1,
                      })}
                    </span>
                    <small>
                      {new Date(session.date).toLocaleDateString(
                        language === "en" ? "en-US" : "ko-KR",
                        { month: "numeric", day: "numeric" }
                      )}
                    </small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.memberId}>
                  <td>
                    <strong>{member.name}</strong>
                  </td>
                  {sessions.map((session, index) => (
                    <td key={session.sessionId}>
                      <span
                        role="img"
                        className={
                          member.attendance?.[index]
                            ? "attendance-yes"
                            : "attendance-no"
                        }
                        aria-label={
                          member.attendance?.[index]
                            ? ui("출석", "Present")
                            : ui("미출석", "Absent")
                        }
                      >
                        {member.attendance?.[index] ? (
                          <Check aria-hidden="true" />
                        ) : (
                          "—"
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog
        open={Boolean(attendanceCode)}
        onOpenChange={(open) => {
          if (!open) setAttendanceCode("");
        }}
      >
        <DialogContent className="study-attendance-modal">
          <DialogHeader>
            <DialogTitle>
              {ui("오늘의 출석 코드", "Today's attendance code")}
            </DialogTitle>
            <DialogDescription>
              {ui(
                "스터디원에게 아래 4자리 코드를 알려주세요.",
                "Share this four-digit code with your members."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="issued-code">{attendanceCode}</div>
          <button
            className="button button-outline button-full"
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(attendanceCode);
              toast({
                description: ui(
                  "출석 코드를 복사했습니다.",
                  "Copied attendance code."
                ),
              });
            }}
          >
            <Copy aria-hidden="true" /> {ui("코드 복사", "Copy code")}
          </button>
        </DialogContent>
      </Dialog>
    </StudyLayout>
  );
};
export default AttendancePage;
