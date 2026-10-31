import {
  type GeneralStudyDetail,
  StudyCategory,
  type StudyCreateUpdateRequest,
  StudyLevel,
  StudyRecruitmentMethod,
} from "@app/api/generated/model";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@app/components/ui/alert-dialog";
import { Button, buttonVariants } from "@app/components/ui/button";
import { Checkbox } from "@app/components/ui/checkbox";
import {
  ErrorText,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@app/components/ui/field";
import { Input } from "@app/components/ui/input";
import { NumberField } from "@app/components/ui/number-field";
import { RadioCard, RadioGroup } from "@app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { Spinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { useI18n } from "@app/i18n";
import { t } from "@app/i18n/store";
import { cn } from "@app/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useId } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type Resolver,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Link, useBlocker } from "react-router";
import { z } from "zod";

export const LIMITS = {
  title: 30,
  description: 1000,
  schedule: 100,
  capacityMin: 1,
  capacityMax: 50,
} as const;

const CATEGORIES = Object.values(StudyCategory);
const LEVELS = Object.values(StudyLevel);
const METHODS = Object.values(StudyRecruitmentMethod);

/** Built per submit so messages follow the selected language. */
function schema() {
  const required = t("study.form.required");
  const text = (max: number) =>
    z
      .string()
      .trim()
      .min(1, required)
      .max(max, t("study.form.maxLength", { max }));
  const rows = z
    .array(
      z.object({ value: z.string().trim().min(1, t("study.form.rowRequired")) })
    )
    .min(1);

  return z
    .object({
      title: text(LIMITS.title),
      category: z.enum(CATEGORIES, t("study.form.requiredSelect")),
      level: z.enum(LEVELS, t("study.form.requiredSelect")),
      recruitmentMethod: z.enum(METHODS, t("study.form.requiredSelect")),
      unlimited: z.boolean(),
      maxParticipants: z.number().nullable(),
      schedule: z
        .string()
        .trim()
        .max(
          LIMITS.schedule,
          t("study.form.maxLength", { max: LIMITS.schedule })
        ),
      description: text(LIMITS.description),
      curricula: rows,
      qualifications: rows,
    })
    .refine(
      (values) =>
        values.unlimited ||
        (values.maxParticipants !== null &&
          values.maxParticipants >= LIMITS.capacityMin &&
          values.maxParticipants <= LIMITS.capacityMax),
      {
        path: ["maxParticipants"],
        message: t("study.form.capacityRange", {
          min: LIMITS.capacityMin,
          max: LIMITS.capacityMax,
        }),
      }
    );
}

type FormInput = {
  title: string;
  category: StudyCategory | null;
  level: StudyLevel | null;
  recruitmentMethod: StudyRecruitmentMethod | null;
  unlimited: boolean;
  maxParticipants: number | null;
  schedule: string;
  description: string;
  curricula: { value: string }[];
  qualifications: { value: string }[];
};

type FormOutput = z.output<ReturnType<typeof schema>>;

function toRows(values: readonly string[] | undefined) {
  return values?.length ? values.map((value) => ({ value })) : [{ value: "" }];
}

function defaultsFrom(study?: GeneralStudyDetail): FormInput {
  return {
    title: study?.title ?? "",
    category: study?.category ?? null,
    level: study?.level ?? null,
    recruitmentMethod: study?.recruitmentMethod ?? null,
    unlimited: study ? study.maxParticipants === 0 : false,
    maxParticipants: study?.maxParticipants || 10,
    schedule: study?.schedule ?? "",
    description: study?.description ?? "",
    curricula: toRows(study?.curricula),
    qualifications: toRows(study?.qualifications),
  };
}

function toRequest(values: FormOutput): StudyCreateUpdateRequest {
  return {
    title: values.title,
    category: values.category,
    level: values.level,
    recruitmentMethod: values.recruitmentMethod,
    maxParticipants: values.unlimited ? 0 : (values.maxParticipants ?? 0),
    schedule: values.schedule || null,
    description: values.description,
    curricula: values.curricula.map((row) => row.value),
    qualifications: values.qualifications.map((row) => row.value),
  };
}

interface StudyFormProps {
  study?: GeneralStudyDetail;
  submitting: boolean;
  /** The server's reason for refusing the last submit. */
  error: string | null;
  cancelTo: string;
  onSubmit: (request: StudyCreateUpdateRequest) => void;
}

export function StudyForm({
  study,
  submitting,
  error,
  cancelTo,
  onSubmit,
}: StudyFormProps) {
  const { t } = useI18n();
  const editing = Boolean(study);
  const form = useForm<FormInput, unknown, FormOutput>({
    defaultValues: defaultsFrom(study),
    // Rebuilt per validation so messages follow the selected language.
    resolver: (values, context, options) =>
      (
        zodResolver(schema()) as unknown as Resolver<
          FormInput,
          unknown,
          FormOutput
        >
      )(values, context, options),
    mode: "onTouched",
  });
  const { control, register, watch, formState } = form;
  const unlimited = watch("unlimited");
  const description = watch("description");
  const methodLabelId = useId();
  const hasErrors = formState.submitCount > 0 && !formState.isValid;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => onSubmit(toRequest(values)))}
      className="grid"
    >
      <FormSection index={1} title={t("study.form.sections.basics")}>
        <Field invalid={Boolean(formState.errors.title)}>
          <FieldLabel required>{t("study.form.title")}</FieldLabel>
          <Input
            {...register("title")}
            placeholder={t("study.form.titlePlaceholder")}
            maxLength={LIMITS.title + 10}
            className="text-[1.0625rem] font-[650]"
          />
          <FieldError>{formState.errors.title?.message}</FieldError>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <ChoiceSelect
            control={control}
            name="category"
            label={t("study.form.category")}
            options={CATEGORIES.map((value) => ({
              value,
              label: t(`study.labels.categories.${value}`),
            }))}
          />
          <ChoiceSelect
            control={control}
            name="level"
            label={t("study.form.level")}
            options={LEVELS.map((value) => ({
              value,
              label: t(`study.labels.levels.${value}`),
            }))}
          />
        </div>

        <Field invalid={Boolean(formState.errors.schedule)}>
          <FieldLabel>{t("study.form.schedule")}</FieldLabel>
          <Input
            {...register("schedule")}
            placeholder={t("study.form.schedulePlaceholder")}
          />
          {formState.errors.schedule ? (
            <FieldError>{formState.errors.schedule.message}</FieldError>
          ) : (
            <FieldDescription>
              {t("study.form.scheduleDescription")}
            </FieldDescription>
          )}
        </Field>
      </FormSection>

      <FormSection index={2} title={t("study.form.sections.recruitment")}>
        <Controller
          control={control}
          name="recruitmentMethod"
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <GroupLabel id={methodLabelId} required>
                {t("study.form.recruitmentMethod")}
              </GroupLabel>
              <RadioGroup
                aria-labelledby={methodLabelId}
                aria-invalid={fieldState.invalid || undefined}
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value as StudyRecruitmentMethod)
                }
                inputRef={field.ref}
                disabled={editing}
                className="sm:grid-cols-2"
              >
                {METHODS.map((method) => (
                  <RadioCard
                    key={method}
                    value={method}
                    label={t(`study.labels.recruitmentMethods.${method}`)}
                    description={t(
                      `study.labels.recruitmentMethodHints.${method}`
                    )}
                  />
                ))}
              </RadioGroup>
              {fieldState.error ? (
                <ErrorText>{fieldState.error.message}</ErrorText>
              ) : (
                editing && (
                  <p className="m-0 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {t("study.form.recruitmentMethodLocked")}
                  </p>
                )
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="maxParticipants"
          render={({ field, fieldState }) => (
            <Field invalid={fieldState.invalid && !unlimited} name={field.name}>
              <FieldLabel>{t("study.form.capacity")}</FieldLabel>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <NumberField
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  min={LIMITS.capacityMin}
                  max={LIMITS.capacityMax}
                  disabled={unlimited}
                  unit={t("study.form.capacityUnit")}
                  decrementLabel={t("common.decrease")}
                  incrementLabel={t("common.increase")}
                />
                <Controller
                  control={control}
                  name="unlimited"
                  render={({ field: unlimitedField }) => (
                    <CheckboxLabel
                      checked={unlimitedField.value}
                      onCheckedChange={(checked) => {
                        unlimitedField.onChange(checked);
                        void form.trigger("maxParticipants");
                      }}
                    >
                      {t("study.form.capacityUnlimited")}
                    </CheckboxLabel>
                  )}
                />
              </div>
              {!unlimited && fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : (
                <FieldDescription>
                  {t("study.form.capacityRange", {
                    min: LIMITS.capacityMin,
                    max: LIMITS.capacityMax,
                  })}
                </FieldDescription>
              )}
            </Field>
          )}
        />
      </FormSection>

      <FormSection index={3} title={t("study.form.sections.content")}>
        <Field invalid={Boolean(formState.errors.description)}>
          <div className="flex items-baseline justify-between gap-4">
            <FieldLabel required>{t("study.form.description")}</FieldLabel>
            <Counter value={description.length} max={LIMITS.description} />
          </div>
          <Textarea
            {...register("description")}
            placeholder={t("study.form.descriptionPlaceholder")}
            className="min-h-56"
          />
          <FieldError>{formState.errors.description?.message}</FieldError>
        </Field>

        <RowsField
          control={control}
          name="curricula"
          label={t("study.form.curricula")}
          description={t("study.form.curriculaDescription")}
          placeholder={(index) =>
            t("study.form.curriculumPlaceholder", { index: index + 1 })
          }
          register={register}
          numbered
        />
        <RowsField
          control={control}
          name="qualifications"
          label={t("study.form.qualifications")}
          description={t("study.form.qualificationsDescription")}
          placeholder={() => t("study.form.qualificationPlaceholder")}
          register={register}
        />
      </FormSection>

      <div className="grid gap-3 border-t border-ink pt-6 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-4">
        {(error || hasErrors) && (
          <p
            role="alert"
            className="m-0 flex items-center gap-2 text-[0.875rem] font-[650] text-danger sm:mr-auto"
          >
            <CircleAlertIcon aria-hidden="true" className="size-4 shrink-0" />
            {error ?? t("study.form.fixErrors")}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="sm:order-last"
        >
          {submitting && <Spinner />}
          {editing ? t("study.form.save") : t("study.form.create")}
        </Button>
        <Link
          to={cancelTo}
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          {t("study.form.cancel")}
        </Link>
      </div>

      <LeaveGuard dirty={formState.isDirty && !submitting} />
    </form>
  );
}

/** Asks before leaving with unsaved changes, in the app and on reload. */
function LeaveGuard({ dirty }: { dirty: boolean }) {
  const { t } = useI18n();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <AlertDialog
      open={blocker.state === "blocked"}
      onOpenChange={(open) => !open && blocker.reset?.()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("study.form.leaveTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("study.form.leaveDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="outline">{t("study.form.stay")}</Button>}
          />
          <Button variant="destructive" onClick={() => blocker.proceed?.()}>
            {t("study.form.leave")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FormSection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="grid min-w-0 gap-x-12 gap-y-6 border-t border-ink pt-6 pb-12 lg:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <h2
        id={id}
        className="m-0 flex items-baseline gap-3 text-[1.375rem] font-[800] tracking-[-0.04em]"
      >
        <span className="eyebrow tabular text-ink-muted">
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="grid min-w-0 gap-7">{children}</div>
    </section>
  );
}

function GroupLabel({
  id,
  required,
  children,
}: {
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      id={id}
      className="flex items-baseline gap-1.5 text-[0.875rem] leading-snug font-[750]"
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-blue">
          *
        </span>
      )}
    </span>
  );
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <span
      className={cn(
        "tabular text-[0.75rem] font-[650] text-ink-subtle",
        value > max && "text-danger"
      )}
    >
      {value} / {max}
    </span>
  );
}

function CheckboxLabel({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-[0.9375rem] font-[700]"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      {children}
    </label>
  );
}

function ChoiceSelect<Name extends "category" | "level">({
  control,
  name,
  label,
  options,
}: {
  control: Control<FormInput, unknown, FormOutput>;
  name: Name;
  label: string;
  options: { value: NonNullable<FormInput[Name]>; label: string }[];
}) {
  const { t } = useI18n();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field invalid={fieldState.invalid} name={field.name}>
          <FieldLabel required nativeLabel={false} render={<div />}>
            {label}
          </FieldLabel>
          <Select
            items={options}
            value={field.value}
            onValueChange={field.onChange}
            onOpenChange={(open) => !open && field.onBlur()}
          >
            <SelectTrigger ref={field.ref}>
              <SelectValue placeholder={t("study.form.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

function RowsField({
  control,
  register,
  name,
  label,
  description,
  placeholder,
  numbered = false,
}: {
  control: Control<FormInput, unknown, FormOutput>;
  register: ReturnType<
    typeof useForm<FormInput, unknown, FormOutput>
  >["register"];
  name: "curricula" | "qualifications";
  label: string;
  description: string;
  placeholder: (index: number) => string;
  numbered?: boolean;
}) {
  const { t } = useI18n();
  const { fields, append, remove } = useFieldArray({ control, name });
  const labelId = useId();

  return (
    <fieldset
      aria-labelledby={labelId}
      className="m-0 grid min-w-0 gap-3 border-0 p-0"
    >
      <div className="grid gap-1">
        <GroupLabel id={labelId} required>
          {label}
        </GroupLabel>
        <span className="text-[0.8125rem] leading-relaxed text-ink-muted">
          {description}
        </span>
      </div>
      <ol className="m-0 grid list-none gap-2 p-0">
        {fields.map((row, index) => (
          <Controller
            key={row.id}
            control={control}
            name={`${name}.${index}.value` as FieldPath<FormInput>}
            render={({ fieldState }) => (
              <li className="grid gap-1.5">
                <div className="flex items-stretch gap-2">
                  {numbered && (
                    <span className="eyebrow tabular grid w-9 shrink-0 place-items-center text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <Input
                    {...register(`${name}.${index}.value`)}
                    aria-label={`${label} ${index + 1}`}
                    aria-invalid={fieldState.invalid || undefined}
                    placeholder={placeholder(index)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("study.form.removeRow", { index: index + 1 })}
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    className="text-ink-muted hover:text-danger"
                  >
                    <Trash2Icon aria-hidden="true" />
                  </Button>
                </div>
                <ErrorText className={cn(numbered && "pl-11")}>
                  {fieldState.error?.message}
                </ErrorText>
              </li>
            )}
          />
        ))}
      </ol>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("w-fit", numbered && "ml-11")}
        onClick={() => append({ value: "" }, { shouldFocus: true })}
      >
        <PlusIcon aria-hidden="true" />
        {t("study.form.addRow")}
      </Button>
    </fieldset>
  );
}
