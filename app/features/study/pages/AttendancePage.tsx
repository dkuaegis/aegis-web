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
import { Button } from "@study/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import Header from "@study/components/ui/Header";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import { Calendar, Check, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AttendanceProps {
  studyId: number;
  onBack: (id: number) => void;
}

const AttendancePage = ({ studyId, onBack }: AttendanceProps) => {
  const { t } = useI18n();
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

  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">{t("study.loading.role")}</div>
        </div>
      </div>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
  }

  if (!isOwner) {
    return (
      <ForbiddenPage
        message={t("study.forbidden.attendance")}
        onBack={() => onBack(studyId)}
      />
    );
  }

  if (isLoadingAttendance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">
            {t("study.loading.attendance")}
          </div>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-500">{attendanceError}</div>
        </div>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">{t("study.attendance.noData")}</div>
        </div>
      </div>
    );
  }

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

  const getStatusIcon = (attendance: boolean | null) => {
    if (attendance === true)
      return <Check className="h-4 w-4 text-green-600" />;
    if (attendance === false) return <X className="h-4 w-4 text-red-600" />;
    return <span className="text-gray-400">—</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={() => onBack(studyId)} />
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("study.attendance.statusTitle")}
            </CardTitle>
            <CardDescription>
              {t("study.attendance.statusDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="min-w-[100px] border border-gray-200 p-3 text-left font-medium">
                        {t("study.attendance.nameColumn")}
                      </th>
                      {sessions.map((session, idx) => (
                        <th
                          key={session.sessionId}
                          className="min-w-[65px] border border-gray-200 p-3 text-center font-medium"
                        >
                          {t("study.attendance.sessionColumn", {
                            index: idx + 1,
                          })}
                        </th>
                      ))}
                      <th className="min-w-[80px] border border-gray-200 p-3 text-center font-medium">
                        {t("study.attendance.rateColumn")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => {
                      const attendance = member.attendance ?? [];
                      const attendanceCount = attendance.filter(Boolean).length;
                      const denominator = sessions.length;
                      const attendanceRate = denominator
                        ? Math.round((attendanceCount / denominator) * 100)
                        : 0;

                      return (
                        <tr key={member.memberId} className="hover:bg-gray-50">
                          <td className="min-w-[100px] border border-gray-200 p-3 font-medium">
                            {member.name}
                          </td>
                          {sessions.map((session, idx) => {
                            const att = attendance[idx];

                            return (
                              <td
                                key={session.sessionId}
                                className="min-w-[60px] border border-gray-200 p-2 text-center"
                              >
                                <div className="flex flex-col items-center gap-1">
                                  {getStatusIcon(att)}
                                </div>
                              </td>
                            );
                          })}
                          <td className="min-w-[80px] border border-gray-200 p-3 text-center font-medium">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-sm">
                              {attendanceRate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                {t("study.attendance.codeSectionTitle")}
              </CardTitle>
              <CardDescription>
                {t("study.attendance.codeSectionDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <StudyConfirmationDialog
                  onConfirm={generateAttendanceCode}
                  isSubmitting={isGenerating}
                  submitText={t("study.attendance.generateShort")}
                  submittingText={t("study.attendance.generating")}
                  title={t("study.attendance.generateConfirmTitle")}
                  description={t("study.attendance.generateConfirmDescription")}
                >
                  <Button
                    disabled={isGenerating}
                    className="group relative w-full overflow-hidden bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold shadow-[0_4px_20px_rgba(59,130,246,0.4),0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2563eb] hover:to-[#1d4ed8] hover:shadow-[0_6px_28px_rgba(59,130,246,0.5),0_12px_40px_rgba(59,130,246,0.3)] rounded-full sm:w-auto"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    </span>
                    <span className="relative z-10">
                      {isGenerating
                        ? t("study.attendance.generating")
                        : t("study.attendance.generate")}
                    </span>
                  </Button>
                </StudyConfirmationDialog>
                {attendanceCode && (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">
                        {t("study.attendance.codeLabel")}
                      </p>
                      <p className="font-bold font-mono text-2xl text-[#3b82f6]">
                        {attendanceCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
