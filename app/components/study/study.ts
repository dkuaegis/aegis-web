import type {
  FeaturePolicyResponse,
  GeneralStudyRolesIdsResponse,
  StudyApplicationStatus,
  StudyCategory,
} from "@app/api/generated/model";
import type { BadgeTone } from "@app/components/ui/badge";
import { t } from "@app/i18n/store";
import { formatDateTime, parseServerDate } from "@app/lib/format";
import { data } from "react-router";

export type StudyRole = "instructor" | "participant" | "applicant";

/**
 * Pastel per category, from the home page's activity palette, so a study's
 * colour reads the same in the list, on its page and in "my studies".
 */
export const CATEGORY_TONE: Record<StudyCategory, string> = {
  LANGUAGE: "var(--tone-green)",
  WEB: "var(--tone-blue)",
  APPLICATION: "var(--tone-periwinkle)",
  GAME: "var(--tone-coral)",
  SECURITY: "var(--tone-rose)",
  COMPUTER_SCIENCE: "var(--tone-sage)",
  ARTIFICIAL_INTELLIGENCE: "var(--tone-lime)",
  DATA_SCIENCE: "var(--tone-sand)",
  ETC: "var(--tone-stone)",
};

/** `maxParticipants` 0 means no limit. */
export function isRecruiting(study: {
  participantCount: number;
  maxParticipants: number;
}): boolean {
  return (
    study.maxParticipants === 0 ||
    study.participantCount < study.maxParticipants
  );
}

export function capacityLabel(study: {
  participantCount: number;
  maxParticipants: number;
}): string {
  return study.maxParticipants === 0
    ? `${t("study.labels.participants", { count: study.participantCount })} · ${t("study.labels.unlimited")}`
    : t("study.labels.participantsOf", {
        count: study.participantCount,
        max: study.maxParticipants,
      });
}

/** The strongest relation wins: leading beats taking part beats applying. */
export function roleOf(
  roles: GeneralStudyRolesIdsResponse,
  studyId: number
): StudyRole | null {
  if (roles.instructorStudyIds.includes(studyId)) return "instructor";
  if (roles.participantStudyIds.includes(studyId)) return "participant";
  if (roles.appliedStudyIds.includes(studyId)) return "applicant";
  return null;
}

/** `upcoming` means a window is set and has not started yet. */
export interface EnrollmentWindow {
  status: "open" | "upcoming" | "closed";
  message: string;
}

/** Sentence describing the sign-up window from the public feature policy. */
export function enrollmentWindow(
  policy: FeaturePolicyResponse
): EnrollmentWindow {
  const {
    studyEnrollmentAllowed,
    studyEnrollmentOpenAt,
    studyEnrollmentCloseAt,
  } = policy;
  if (studyEnrollmentAllowed) {
    return {
      status: "open",
      message: studyEnrollmentCloseAt
        ? t("study.enrollment.openUntil", {
            date: formatDateTime(studyEnrollmentCloseAt),
          })
        : t("study.enrollment.openAlways"),
    };
  }
  const now = Date.now();
  if (
    studyEnrollmentOpenAt &&
    parseServerDate(studyEnrollmentOpenAt).getTime() > now
  ) {
    return {
      status: "upcoming",
      message: t("study.enrollment.opensAt", {
        date: formatDateTime(studyEnrollmentOpenAt),
      }),
    };
  }
  if (
    studyEnrollmentCloseAt &&
    parseServerDate(studyEnrollmentCloseAt).getTime() <= now
  ) {
    return {
      status: "closed",
      message: t("study.enrollment.ended", {
        date: formatDateTime(studyEnrollmentCloseAt),
      }),
    };
  }
  return { status: "closed", message: t("study.enrollment.closedNoDate") };
}

/** Route params are strings; anything that is not a positive id is a 404. */
export function parseId(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw data(null, { status: 404 });
  }
  return id;
}

export const APPLICATION_STATUS_TONE = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "neutral",
  NONE: "neutral",
} as const satisfies Record<StudyApplicationStatus, BadgeTone>;
