import { useI18n } from "@app/i18n";
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
  const { t } = useI18n();
  const {
    isInstructor,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  const [members, setMembers] = useState<StudyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const isOwner = isInstructor(studyId);
  const isLoading = loading || isRoleLoading;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (isRoleLoading) return;
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
            : t("study.members.loadError");
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
              ? t("study.loading.role")
              : t("study.loading.members")}
          </div>
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
        message={t("study.forbidden.members")}
        onBack={onBack}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-500">{error}</div>
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
              {t("study.members.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.length === 0 ? (
                <div className="text-gray-500">{t("study.members.empty")}</div>
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
  const { t } = useI18n();
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
                aria-label={t("study.members.copyPhone")}
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
                  {t("study.members.phoneCopied")}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center text-gray-500 text-sm">
              <span className="mr-2 font-medium">🎓</span>
              {t("study.members.studentIdLabel")}: {member.studentNumber}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
