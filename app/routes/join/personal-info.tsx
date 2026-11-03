import {
  getPersonalInfo,
  updatePersonalInfo,
} from "@app/api/generated/endpoints";
import type {
  Department,
  PersonalInfoUpdateRequest,
} from "@app/api/generated/model";
import { StepActions, stepButtonClassName } from "@app/components/join/Funnel";
import {
  DEPARTMENTS,
  departmentLabel,
  drafts,
  GRADES,
  joinPath,
  type PersonalInfoForm,
} from "@app/components/join/join";
import {
  digits,
  formatPhoneNumber,
  fromServer,
  isValidBirthDate,
  toRequest,
} from "@app/components/join/personal-info";
import { Button } from "@app/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@app/components/ui/combobox";
import {
  ErrorText,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@app/components/ui/field";
import { Input } from "@app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t } from "@app/i18n/store";
import { runAction } from "@app/lib/actions";
import { localizedResolver, useJsonSubmit } from "@app/lib/forms";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { redirect } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/personal-info";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { info: await getPersonalInfo({ signal: request.signal }) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const body = (await request.json()) as PersonalInfoUpdateRequest;
  const result = await runAction("save", () => updatePersonalInfo(body), {
    errors: { fallback: t("join.actions.submitFailed") },
  });
  if (result.ok) throw redirect(joinPath("survey"));
  return result;
}

/** Built per validation so messages follow the selected language. */
function schema() {
  return z.object({
    phoneNumber: z
      .string()
      .min(1, t("join.personalInfo.validation.phoneRequired"))
      // The same format PersonalInfoUpdateRequest accepts.
      .regex(
        /^010-\d{4}-\d{4}$/,
        t("join.personalInfo.validation.phoneFormat")
      ),
    studentId: z
      .string()
      .length(8, t("join.personalInfo.validation.studentIdLength"))
      .regex(/^32\d{6}$/, t("join.personalInfo.validation.studentIdFormat")),
    birthDate: z
      .string()
      .length(6, t("join.personalInfo.validation.birthDateLength"))
      .refine(
        isValidBirthDate,
        t("join.personalInfo.validation.birthDateInvalid")
      ),
    genderDigit: z
      .string()
      .regex(/^[1-8]$/, t("join.personalInfo.validation.genderDigit")),
    department: z.enum(
      DEPARTMENTS,
      t("join.personalInfo.validation.departmentRequired")
    ),
    grade: z.enum(GRADES, t("join.personalInfo.validation.gradeRequired")),
  });
}

type FormOutput = z.output<ReturnType<typeof schema>>;

export default function PersonalInfo({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t, language } = useI18n();
  const { submitting, submitJson } = useJsonSubmit();

  const form = useForm<PersonalInfoForm, unknown, FormOutput>({
    defaultValues: drafts.personalInfo ?? fromServer(loaderData.info),
    resolver: localizedResolver(schema),
    mode: "onTouched",
  });
  const { control, formState } = form;

  // Going back a step keeps what was typed here.
  useEffect(
    () => () => {
      drafts.personalInfo = form.getValues();
    },
    [form]
  );

  const residentError =
    formState.errors.birthDate?.message ??
    formState.errors.genderDigit?.message;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => submitJson(toRequest(values)))}
    >
      <FieldGroup>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Field invalid={fieldState.invalid} name={field.name}>
              <FieldLabel>{t("join.personalInfo.phoneLabel")}</FieldLabel>
              <Input
                ref={field.ref}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t("join.personalInfo.phonePlaceholder")}
                maxLength={13}
                value={field.value}
                onChange={(event) =>
                  field.onChange(formatPhoneNumber(event.target.value))
                }
                onBlur={field.onBlur}
                className="tabular"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="studentId"
          render={({ field, fieldState }) => (
            <Field invalid={fieldState.invalid} name={field.name}>
              <FieldLabel>{t("join.personalInfo.studentIdLabel")}</FieldLabel>
              <Input
                ref={field.ref}
                inputMode="numeric"
                placeholder={t("join.personalInfo.studentIdPlaceholder")}
                maxLength={8}
                value={field.value}
                onChange={(event) =>
                  field.onChange(digits(event.target.value, 8))
                }
                onBlur={field.onBlur}
                className="tabular"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <FieldSet className="gap-2">
          <FieldLegend className="mb-0">
            {t("join.personalInfo.residentNumberLabel")}
          </FieldLegend>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="birthDate"
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  inputMode="numeric"
                  aria-label={t("join.personalInfo.birthDatePlaceholder")}
                  aria-invalid={fieldState.invalid || undefined}
                  placeholder={t("join.personalInfo.birthDatePlaceholder")}
                  maxLength={6}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(digits(event.target.value, 6))
                  }
                  onBlur={field.onBlur}
                  className="tabular min-w-0 flex-1"
                />
              )}
            />
            <span aria-hidden="true" className="font-[700] text-ink-subtle">
              -
            </span>
            <Controller
              control={control}
              name="genderDigit"
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  inputMode="numeric"
                  aria-label={t("join.personalInfo.residentNumberBackLabel")}
                  aria-invalid={fieldState.invalid || undefined}
                  maxLength={1}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(digits(event.target.value, 1))
                  }
                  onBlur={field.onBlur}
                  className="tabular w-12 shrink-0 px-0 text-center"
                />
              )}
            />
            {/* The other six digits are never asked for. */}
            <span
              aria-hidden="true"
              className="shrink-0 text-[0.625rem] tracking-[0.3em] text-ink-subtle"
            >
              ●●●●●●
            </span>
          </div>
          <ErrorText>{residentError}</ErrorText>
        </FieldSet>

        <Controller
          control={control}
          name="department"
          render={({ field, fieldState }) => (
            <Field invalid={fieldState.invalid} name={field.name}>
              <FieldLabel>{t("join.personalInfo.departmentLabel")}</FieldLabel>
              <Combobox<Department>
                items={DEPARTMENTS}
                value={field.value}
                onValueChange={field.onChange}
                itemToStringLabel={(value) => departmentLabel(value, language)}
                // Korean names stay searchable in every language.
                filter={(value, query) => {
                  const text = query.trim().toLowerCase();
                  return (
                    departmentLabel(value, language)
                      .toLowerCase()
                      .includes(text) || value.includes(text)
                  );
                }}
              >
                <ComboboxInput
                  ref={field.ref}
                  onBlur={field.onBlur}
                  placeholder={t(
                    "join.personalInfo.departmentSearchPlaceholder"
                  )}
                />
                <ComboboxContent>
                  <ComboboxEmpty>
                    {t("join.personalInfo.departmentEmpty")}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(value: Department) => (
                      <ComboboxItem key={value} value={value}>
                        {departmentLabel(value, language)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="grade"
          render={({ field, fieldState }) => (
            <Field invalid={fieldState.invalid} name={field.name}>
              <FieldLabel nativeLabel={false} render={<div />}>
                {t("join.personalInfo.gradeLabel")}
              </FieldLabel>
              <Select
                items={GRADES.map((grade) => ({
                  value: grade,
                  label: t(`join.personalInfo.grades.${grade}`),
                }))}
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(open) => !open && field.onBlur()}
              >
                <SelectTrigger ref={field.ref}>
                  <SelectValue
                    placeholder={t("join.personalInfo.gradePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {t(`join.personalInfo.grades.${grade}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <StepActions
        step="personal-info"
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
