import { getStudy, updateStudy } from "@app/api/generated/endpoints";
import type { StudyCreateUpdateRequest } from "@app/api/generated/model";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { StateMessage } from "@app/components/page/States";
import { StudyForm } from "@app/components/study/StudyForm";
import { parseId, roleOf } from "@app/components/study/study";
import { useStudyContext } from "@app/components/study/useStudyContext";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction } from "@app/lib/actions";
import { useJsonSubmit } from "@app/lib/forms";
import { pageTitle } from "@app/lib/title";
import { redirect } from "react-router";
import type { Route } from "./+types/edit";

export function meta() {
  return [{ title: pageTitle(translate("study.form.editMetaTitle")) }];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  return { study: await getStudy(studyId, { signal: request.signal }) };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const studyId = parseId(params.studyId);
  const body = (await request.json()) as StudyCreateUpdateRequest;
  const result = await runAction("update", () => updateStudy(studyId, body), {
    success: translate("study.form.saved"),
  });
  if (result.ok) throw redirect(`/study/${studyId}`);
  return result;
}

export default function EditStudy({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t } = useI18n();
  const { roles } = useStudyContext();
  const { study } = loaderData;
  const { submitting, submitJson } = useJsonSubmit();
  const back = `/study/${study.id}`;

  return (
    <div className="narrow-frame">
      <PageHeader
        className="border-b-0"
        back={{ to: back, label: t("study.form.back") }}
        title={t("study.form.editTitle")}
        description={study.title}
      />
      <PageBody className="pt-0">
        {roleOf(roles, study.id) === "instructor" ? (
          <StudyForm
            study={study}
            submitting={submitting}
            error={submitting ? null : (actionData?.message ?? null)}
            cancelTo={back}
            onSubmit={submitJson}
          />
        ) : (
          <StateMessage
            role="alert"
            title={t("common.errorCode.STUDY_MEMBER_NOT_INSTRUCTOR")}
          />
        )}
      </PageBody>
    </div>
  );
}
