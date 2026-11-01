import {
  getPersonalInfo,
  updatePersonalInfo,
} from "@app/api/generated/endpoints";
import {
  type Department,
  Gender,
  type PersonalInfoResponse,
  type PersonalInfoUpdateRequest,
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
import { jsonBody } from "@app/lib/actions";
import { errorMessage } from "@app/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { redirect, useNavigation, useSubmit } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/personal-info";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { info: await getPersonalInfo({ signal: request.signal }) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const body = (await request.json()) as PersonalInfoUpdateRequest;
  try {
    await updatePersonalInfo(body);
  } catch (error) {
    return {
      message: errorMessage(error, {
        fallback: t("join.actions.submitFailed"),
      }),
    };
  }
  throw redirect(joinPath("survey"));
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
  const submit = useSubmit();
  const navigation = useNavigation();
  const submitting = navigation.state !== "idle";

  const form = useForm<PersonalInfoForm, unknown, FormOutput>({
    defaultValues: drafts.personalInfo ?? fromServer(loaderData.info),
    resolver: (values, context, options) =>
      (
        zodResolver(schema()) as unknown as Resolver<
          PersonalInfoForm,
          unknown,
          FormOutput
        >
      )(values, context, options),
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
      onSubmit={form.handleSubmit((values) =>
        submit(jsonBody(toRequest(values)), {
          method: "post",
          encType: "application/json",
        })
      )}
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

/**
 * Saved answers, except the grade: it changes every year, so it is asked
 * again rather than carried over from the last time.
 */
function fromServer(info: PersonalInfoResponse): PersonalInfoForm {
  return {
    phoneNumber: info.phoneNumber ?? "",
    studentId: info.studentId ?? "",
    birthDate: info.birthDate ?? "",
    genderDigit:
      info.birthDate && info.gender
        ? genderDigit(info.birthDate, info.gender)
        : "",
    department: info.department,
    grade: null,
  };
}

function toRequest(values: FormOutput): PersonalInfoUpdateRequest {
  return {
    phoneNumber: values.phoneNumber,
    studentId: values.studentId,
    birthDate: values.birthDate,
    department: values.department,
    grade: values.grade,
    gender: Number(values.genderDigit) % 2 ? Gender.MALE : Gender.FEMALE,
  };
}

/** 1 and 2 for births in the 1900s, 3 and 4 from 2000; odd is male. */
function genderDigit(birthDate: string, gender: Gender): string {
  const before2000 = Number(birthDate.slice(0, 2)) >= 50;
  const male = gender === Gender.MALE;
  return String((before2000 ? 1 : 3) + (male ? 0 : 1));
}

function digits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/** "01012345678" to "010-1234-5678" as it is typed. */
function formatPhoneNumber(value: string): string {
  const raw = digits(value, 11);
  if (raw.length <= 3) return raw;
  if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
}

/** A real calendar date in YYMMDD, read as 1950 to 2049. */
function isValidBirthDate(value: string): boolean {
  if (!/^\d{6}$/.test(value)) return false;
  const yy = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  const year = yy >= 50 ? 1900 + yy : 2000 + yy;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}
