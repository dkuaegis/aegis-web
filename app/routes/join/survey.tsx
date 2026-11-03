import { getSurvey, saveSurvey } from "@app/api/generated/endpoints";
import type { AcquisitionType, SurveyCommon } from "@app/api/generated/model";
import { StepActions, stepButtonClassName } from "@app/components/join/Funnel";
import {
  ACQUISITION_TYPES,
  drafts,
  joinPath,
  type SurveyForm,
} from "@app/components/join/join";
import { Button } from "@app/components/ui/button";
import {
  ErrorText,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { useI18n } from "@app/i18n";
import { t } from "@app/i18n/store";
import { runAction } from "@app/lib/actions";
import { hasStatus } from "@app/lib/errors";
import { localizedResolver, useJsonSubmit } from "@app/lib/forms";
import { cn } from "@app/lib/utils";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { redirect } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/survey";

const JOIN_REASON_MAX = 511;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    return { survey: await getSurvey({ signal: request.signal }) };
  } catch (error) {
    // Nothing saved yet.
    if (hasStatus(error, 404)) return { survey: null };
    throw error;
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const body = (await request.json()) as SurveyCommon;
  const result = await runAction("save", () => saveSurvey(body), {
    errors: { fallback: t("join.actions.submitFailed") },
  });
  if (result.ok) throw redirect(joinPath("chat"));
  return result;
}

/** Built per validation so messages follow the selected language. */
function schema() {
  return z.object({
    acquisitionType: z.enum(
      ACQUISITION_TYPES.map(({ value }) => value),
      t("join.survey.validation.acquisitionRequired")
    ),
    joinReason: z
      .string()
      .trim()
      .min(5, t("join.survey.validation.joinReasonMin"))
      .max(JOIN_REASON_MAX, t("join.survey.validation.joinReasonMax")),
  });
}

type FormOutput = z.output<ReturnType<typeof schema>>;

export default function Survey({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t } = useI18n();
  const { submitting, submitJson } = useJsonSubmit();
  const acquisitionLabelId = useId();

  const form = useForm<SurveyForm, unknown, FormOutput>({
    defaultValues: drafts.survey ?? {
      acquisitionType: loaderData.survey?.acquisitionType ?? null,
      joinReason: loaderData.survey?.joinReason ?? "",
    },
    resolver: localizedResolver(schema),
    mode: "onTouched",
  });
  const { control, register, formState } = form;

  // Going back a step keeps what was typed here.
  useEffect(
    () => () => {
      drafts.survey = form.getValues();
    },
    [form]
  );

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        submitJson(values satisfies SurveyCommon)
      )}
    >
      <FieldGroup>
        <Controller
          control={control}
          name="acquisitionType"
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <p
                id={acquisitionLabelId}
                className="m-0 text-[0.875rem] leading-snug font-[750]"
              >
                {t("join.survey.acquisitionLabel")}
              </p>
              <RadioGroup
                aria-labelledby={acquisitionLabelId}
                aria-invalid={fieldState.invalid || undefined}
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value as AcquisitionType)
                }
                inputRef={field.ref}
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {ACQUISITION_TYPES.map(({ value, icon }) => (
                  <Radio.Root
                    key={value}
                    value={value}
                    className={cn(
                      "grid min-h-28 cursor-pointer content-center justify-items-center gap-2.5 border border-line-strong bg-paper-raised px-2 py-4 text-center transition-[border-color,box-shadow] outline-none",
                      "hover:border-ink/55 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                      "data-checked:border-ink data-checked:shadow-[inset_0_0_0_1px_var(--ink)]"
                    )}
                  >
                    <img src={icon} alt="" className="size-10" />
                    <span className="text-[0.875rem] leading-snug font-[700]">
                      {t(`join.survey.acquisitionTypes.${value}`)}
                    </span>
                  </Radio.Root>
                ))}
              </RadioGroup>
              <ErrorText>{fieldState.error?.message}</ErrorText>
            </div>
          )}
        />

        <Field invalid={Boolean(formState.errors.joinReason)}>
          <FieldLabel>{t("join.survey.joinReasonLabel")}</FieldLabel>
          <Textarea
            {...register("joinReason")}
            placeholder={t("join.survey.joinReasonPlaceholder")}
            maxLength={JOIN_REASON_MAX}
            className="min-h-48"
          />
          <FieldError>{formState.errors.joinReason?.message}</FieldError>
        </Field>
      </FieldGroup>

      <StepActions
        step="survey"
        error={submitting ? null : actionData?.message}
      >
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className={stepButtonClassName}
        >
          {submitting && <Spinner />}
          {t("join.actions.next")}
        </Button>
      </StepActions>
    </form>
  );
}
