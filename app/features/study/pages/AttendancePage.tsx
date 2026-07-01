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
  // 사용자 역할 확인
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

  // 권한 확인 - 강사만 출석 코드를 생성할 수 있음
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
            : "출석 데이터를 불러오는데 실패했습니다.";
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
          <div className="text-gray-500">권한 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
    // 권한 오류 시에도 기본 권한으로 계속 진행
  }

  // 권한이 없는 경우
  if (!isOwner) {
    return (
      <ForbiddenPage
        message="이 스터디의 출석을 관리할 수 있는 권한이 없습니다."
        onBack={() => onBack(studyId)}
      />
    );
  }

  if (isLoadingAttendance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">출석 데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-600">{attendanceError}</div>
        </div>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={() => onBack(studyId)} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">출석 데이터가 없습니다.</div>
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
        err instanceof Error ? err.message : "출석 코드 발급에 실패했습니다.";
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
              출석 현황
            </CardTitle>
            <CardDescription>
              스터디의 출석 현황을 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="min-w-[100px] border border-gray-200 p-3 text-left font-medium">
                        이름
                      </th>
                      {sessions.map((session, idx) => (
                        <th
                          key={session.sessionId}
                          className="min-w-[65px] border border-gray-200 p-3 text-center font-medium"
                        >
                          {idx + 1}회차
                        </th>
                      ))}
                      <th className="min-w-[80px] border border-gray-200 p-3 text-center font-medium">
                        출석률
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
                출석 코드 관리
              </CardTitle>
              <CardDescription>출석 코드를 생성합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <StudyConfirmationDialog
                  onConfirm={generateAttendanceCode}
                  isSubmitting={isGenerating}
                  submitText="생성"
                  submittingText="생성 중..."
                  title="출석 코드 생성 확인"
                  description="정말로 생성하시겠습니까? 생성된 출석 코드는 생성한 당일에만 유효합니다."
                >
                  <Button
                    disabled={isGenerating}
                    className="group relative w-full overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700 sm:w-auto"
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
                      {isGenerating ? "생성 중..." : "출석 코드 생성"}
                    </span>
                  </Button>
                </StudyConfirmationDialog>
                {attendanceCode && (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">출석 코드</p>
                      <p className="font-bold font-mono text-2xl text-blue-600">
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
