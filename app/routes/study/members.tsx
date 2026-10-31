import { getStudyMembers } from "@app/api/generated/endpoints";
import { EmptyState } from "@app/components/page/States";
import { parseId } from "@app/components/study/study";
import { Button } from "@app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { CopyIcon } from "lucide-react";
import type { Route } from "./+types/members";

export function meta() {
  return [{ title: `${translate("study.members.metaTitle")} | AEGIS` }];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const members = await getStudyMembers(studyId, { signal: request.signal });
  members.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return { members };
}

function copy(text: string, success: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(success))
    .catch(() => toast.error(translate("common.copyFailed")));
}

export default function Members({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { members } = loaderData;

  if (members.length === 0) {
    return (
      <EmptyState
        title={t("study.members.empty")}
        description={t("study.members.emptyDescription")}
      />
    );
  }

  const withPhone = members.filter((member) => member.phoneNumber);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[1rem] font-[750]">
          <span className="tabular">
            {t("study.members.count", { count: members.length })}
          </span>
        </p>
        {withPhone.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copy(
                withPhone
                  .map((member) => `${member.name} ${member.phoneNumber}`)
                  .join("\n"),
                t("study.members.copiedAll", { count: withPhone.length })
              )
            }
          >
            <CopyIcon aria-hidden="true" />
            {t("study.members.copyAll")}
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">#</TableHead>
            <TableHead>{t("study.applications.name")}</TableHead>
            <TableHead>{t("study.applications.studentId")}</TableHead>
            <TableHead>{t("study.applications.phone")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={`${member.name}-${member.studentId ?? index}`}>
              <TableCell className="tabular eyebrow text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </TableCell>
              <TableCell className="font-[750]">{member.name}</TableCell>
              <TableCell className="tabular text-ink-muted">
                {member.studentId ?? "–"}
              </TableCell>
              <TableCell className="tabular">
                {member.phoneNumber ? (
                  <span className="inline-flex items-center gap-1">
                    {member.phoneNumber}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("study.members.copyPhone", {
                        name: member.name,
                      })}
                      onClick={() =>
                        copy(
                          member.phoneNumber ?? "",
                          t("study.members.copiedPhone")
                        )
                      }
                      className="text-ink-muted"
                    >
                      <CopyIcon aria-hidden="true" />
                    </Button>
                  </span>
                ) : (
                  <span className="text-ink-subtle">–</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
