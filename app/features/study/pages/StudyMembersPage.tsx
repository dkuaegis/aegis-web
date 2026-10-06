import { useI18n } from "@app/i18n";
import { fetchStudyMembers } from "@study/api/studyMembersApi";
import StudyLayout, {
  StudyEmpty,
  StudyError,
  StudyLoading,
  useStudyUiText,
} from "@study/components/ui/StudyLayout";
import { useToast } from "@study/components/ui/useToast";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import { Check, Copy } from "lucide-react";
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
  const ui = useStudyUiText();
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Keep the existing fetch lifecycle; t only supplies fallback error copy.
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
          err instanceof Error ? err.message : t("study.members.loadError");
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
      <StudyLayout onBack={onBack}>
        <StudyLoading
          label={
            isRoleLoading ? t("study.loading.role") : t("study.loading.members")
          }
        />
      </StudyLayout>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
  }

  if (!isOwner) {
    return (
      <ForbiddenPage message={t("study.forbidden.members")} onBack={onBack} />
    );
  }

  if (error) {
    return (
      <StudyLayout onBack={onBack}>
        <StudyError message={error} />
      </StudyLayout>
    );
  }
  return (
    <StudyLayout
      wide
      onBack={onBack}
      title={ui("스터디원", "Study members")}
      actions={
        <button
          className="button button-outline"
          type="button"
          disabled={!members.length}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                members
                  .map((member) => `${member.name} ${member.phone}`)
                  .join("\n")
              );
              toast({
                description: ui(
                  "스터디원 연락처를 복사했습니다.",
                  "Copied members' contact information."
                ),
              });
            } catch {
              toast({
                description: ui(
                  "스터디원 연락처를 복사하지 못했습니다.",
                  "Could not copy members' contact information."
                ),
              });
            }
          }}
        >
          <Copy aria-hidden="true" />{" "}
          {ui("연락처 전체 복사", "Copy all contacts")}
        </button>
      }
    >
      {members.length === 0 ? (
        <StudyEmpty
          title={ui("아직 스터디원이 없습니다.", "There are no members yet.")}
        />
      ) : (
        <div className="member-grid">
          {members.map((member) => (
            <MemberCard key={member.studentNumber} member={member} />
          ))}
        </div>
      )}
    </StudyLayout>
  );
}

function MemberCard({ member }: { member: StudyMember }) {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(member.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <article className="paper-card member-card">
      <div className="member-avatar">{member.name.slice(0, 1)}</div>
      <div>
        <h2>{member.name}</h2>
        <p>{member.studentNumber}</p>
        <a href={`tel:${member.phone}`}>{member.phone}</a>
      </div>
      <button
        className="icon-button"
        type="button"
        aria-label={
          copied
            ? t("study.members.phoneCopied")
            : `${member.name} ${ui("연락처 복사", "copy contact")}`
        }
        onClick={handleCopy}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? t("study.members.phoneCopied") : ""}
      </span>
    </article>
  );
}
