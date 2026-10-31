import { getStudy, updateStudy } from "@app/api/generated/endpoints";
import type { StudyCreateUpdateRequest } from "@app/api/generated/model";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { StateMessage } from "@app/components/page/States";
import { StudyForm } from "@app/components/study/StudyForm";
import { parseId, roleOf } from "@app/components/study/study";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { jsonBody } from "@app/lib/actions";
import { errorMessage } from "@app/lib/errors";
import { redirect, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/edit";
import { useStudyContext } from "./layout";

export function meta() {
  return [{ title: `${translate("study.form.editMetaTitle")} | AEGIS` }];
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
  try {
    await updateStudy(studyId, body);
    toast.success(translate("study.form.saved"));
    return redirect(`/study/${studyId}`);
  } catch (error) {
    return { message: errorMessage(error) };
  }
}

export default function EditStudy({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t } = useI18n();
  const { roles } = useStudyContext();
  const { study } = loaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const back = `/study/${study.id}`;

  return (
    <div className="form-frame">
      <PageHeader
        className="border-b-0"
        back={{ to: back, label: t("study.form.back") }}
        eyebrow={t("study.form.editEyebrow")}
        title={study.title}
        period={false}
      />
      <PageBody className="pt-0">
        {roleOf(roles, study.id) === "instructor" ? (
          <StudyForm
            study={study}
            submitting={navigation.state !== "idle"}
            error={
              navigation.state === "idle" ? (actionData?.message ?? null) : null
            }
            cancelTo={back}
            onSubmit={(request) =>
              submit(jsonBody(request), {
                method: "post",
                encType: "application/json",
              })
            }
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
