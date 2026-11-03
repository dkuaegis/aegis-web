import type { GeneralStudyDetail } from "@app/api/generated/model";
import { useI18n } from "@app/i18n";
import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardListIcon,
  PencilLineIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";
import { Panel } from "./Panel";

export function InstructorPanel({ study }: { study: GeneralStudyDetail }) {
  const { t } = useI18n();
  const links = [
    study.recruitmentMethod === "APPLICATION" && {
      to: `/study/${study.id}/applications`,
      label: t("study.instructor.applications"),
      icon: ClipboardListIcon,
    },
    {
      to: `/study/${study.id}/members`,
      label: t("study.instructor.members"),
      icon: UsersIcon,
    },
    {
      to: `/study/${study.id}/attendance`,
      label: t("study.instructor.attendance"),
      icon: CheckIcon,
    },
    {
      to: `/study/${study.id}/edit`,
      label: t("study.instructor.edit"),
      icon: PencilLineIcon,
    },
  ].filter((link) => link !== false);

  return (
    <Panel heading={t("study.instructor.heading")} className="gap-3">
      <nav className="grid divide-y divide-line">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 py-3.5 last:pb-0 text-[1.0625rem] font-[750] tracking-[-0.02em] transition-colors hover:text-blue"
          >
            <Icon aria-hidden="true" className="size-4.5 text-ink-muted" />
            <span className="flex-1">{label}</span>
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </nav>
    </Panel>
  );
}
