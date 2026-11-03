import { createStudy } from "@app/api/generated/endpoints";
import type { StudyCreateUpdateRequest } from "@app/api/generated/model";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { StateMessage } from "@app/components/page/States";
import { StudyForm } from "@app/components/study/StudyForm";
import { useStudyContext } from "@app/components/study/useStudyContext";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction } from "@app/lib/actions";
import { useJsonSubmit } from "@app/lib/forms";
import { pageTitle } from "@app/lib/title";
import { redirect } from "react-router";
import type { Route } from "./+types/new";

export function meta() {
  return [{ title: pageTitle(translate("study.form.createMetaTitle")) }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const body = (await request.json()) as StudyCreateUpdateRequest;
  const result = await runAction("create", () => createStudy(body), {
    success: translate("study.form.created"),
  });
  if (result.ok) throw redirect(`/study/${result.data.id}`);
  return result;
}

export default function NewStudy({ actionData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { policy } = useStudyContext();
  const { submitting, submitJson } = useJsonSubmit();

  return (
    <div className="narrow-frame">
      <PageHeader
        className="border-b-0"
        back={{ to: "/study", label: t("study.detail.back") }}
        title={t("study.form.createTitle")}
        description={t("study.form.createDescription")}
      />
      <PageBody className="pt-0">
        {policy.studyCreationAllowed ? (
          <StudyForm
            submitting={submitting}
            error={submitting ? null : (actionData?.message ?? null)}
            cancelTo="/study"
            onSubmit={submitJson}
          />
        ) : (
          <StateMessage role="status" title={t("study.list.creationClosed")} />
        )}
      </PageBody>
    </div>
  );
}
