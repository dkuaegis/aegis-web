import { fetchStudyMembers } from "@study/api/studyMembersApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import Header from "@study/components/ui/Header";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import { Copy, User } from "lucide-react";
import { useEffect, useState } from "react";

interface StudyMember {
  name: string;
  studentNumber: string;
  phone: string;
}

interface StudyMembersProps {
  studyId: number;
  onBack: () => void;
}

export default function StudyMembersPage({
  studyId,
  onBack,
}: StudyMembersProps) {
  // 사용자 역할 확인
  const {
    isInstructor,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  const [members, setMembers] = useState<StudyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // 권한 확인 - 강사만 스터디원 관리를 할 수 있음
  const isOwner = isInstructor(studyId);

  // 로딩 상태 처리
  const isLoading = loading || isRoleLoading;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    // 권한 로딩 중이면 대기
    if (isRoleLoading) return;
    // 비소유자는 즉시 로딩 종료 후 반환 (API 호출 금지)
    if (!isOwner) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchStudyMembers(studyId, signal)
      .then((data) => {
        setMembers(
          data.map((m) => ({
            name: m.name,
            studentNumber: m.studentId,
            phone: m.phoneNumber,
          }))
        );
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;

        const msg =
          err instanceof Error
            ? err.message
            : "스터디원 정보를 불러오지 못했습니다.";
        toast({ description: msg });
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [studyId, toast, isOwner, isRoleLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">
            {isRoleLoading
              ? "권한 정보를 불러오는 중..."
              : "스터디원 정보를 불러오는 중..."}
          </div>
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
        message="이 스터디의 스터디원을 관리할 수 있는 권한이 없습니다."
        onBack={onBack}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={onBack} />
      <div className="mx-auto max-w-4xl p-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-900 text-lg">
              스터디원 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.length === 0 ? (
                <div className="text-gray-500">스터디원이 없습니다.</div>
              ) : (
                members.map((member) => (
                  <MemberCard key={member.studentNumber} member={member} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: StudyMember }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(member.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <div className="mt-1 flex items-center text-gray-500 text-sm">
              <span className="mr-2 font-medium">📞</span>
              <span>{member.phone}</span>
              <button
                type="button"
                aria-label="전화번호 복사"
                className="ml-2 rounded p-1 transition hover:bg-gray-200"
                onClick={handleCopy}
              >
                <Copy
                  className={copied ? "text-green-600" : "text-gray-400"}
                  size={16}
                />
              </button>
              {copied && (
                <span className="ml-2 text-green-600 text-xs">
                  전화번호가 복사되었습니다!
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center text-gray-500 text-sm">
              <span className="mr-2 font-medium">🎓</span>
              학번: {member.studentNumber}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
