import { createStudy } from "@app/api/generated/endpoints";
import type { StudyCreateUpdateRequest } from "@app/api/generated/model";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { StateMessage } from "@app/components/page/States";
import { StudyForm } from "@app/components/study/StudyForm";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { jsonBody } from "@app/lib/actions";
import { errorMessage } from "@app/lib/errors";
import { redirect, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/new";
import { useStudyContext } from "./layout";

export function meta() {
  return [{ title: `${translate("study.form.createMetaTitle")} | AEGIS` }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const body = (await request.json()) as StudyCreateUpdateRequest;
  try {
    const study = await createStudy(body);
    toast.success(translate("study.form.created"));
    return redirect(`/study/${study.id}`);
  } catch (error) {
    return { message: errorMessage(error) };
  }
}

export default function NewStudy({ actionData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { policy } = useStudyContext();
  const submit = useSubmit();
  const navigation = useNavigation();

  return (
    <>
      <PageHeader
        className="border-b-0"
        back={{ to: "/study", label: t("study.detail.back") }}
        eyebrow={t("study.form.createEyebrow")}
        title={t("study.form.createTitle")}
        description={t("study.form.createDescription")}
      />
      <PageBody className="pt-0">
        {policy.studyCreationAllowed ? (
          <StudyForm
            submitting={navigation.state !== "idle"}
            error={
              navigation.state === "idle" ? (actionData?.message ?? null) : null
            }
            cancelTo="/study"
            onSubmit={(request) =>
              submit(jsonBody(request), {
                method: "post",
                encType: "application/json",
              })
            }
          />
        ) : (
          <StateMessage role="status" title={t("study.list.creationClosed")} />
        )}
      </PageBody>
    </>
  );
}
