import {
  type GeneralStudyDetail,
  StudyCategory,
  type StudyCreateUpdateRequest,
  StudyLevel,
  StudyRecruitmentMethod,
} from "@app/api/generated/model";
import { t } from "@app/i18n/store";
import { z } from "zod";

/** Matches `StudyCreateUpdateRequest` on the server. */
export const LIMITS = {
  title: 30,
  description: 1000,
  schedule: 100,
  capacityMin: 1,
  capacityMax: 100,
} as const;

export const CATEGORIES = Object.values(StudyCategory);
export const LEVELS = Object.values(StudyLevel);
export const METHODS = Object.values(StudyRecruitmentMethod);

/** Built per submit so messages follow the selected language. */
export function schema() {
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

export type FormInput = {
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

export type FormOutput = z.output<ReturnType<typeof schema>>;

function toRows(values: readonly string[] | undefined) {
  return values?.length ? values.map((value) => ({ value })) : [{ value: "" }];
}

export function defaultsFrom(study?: GeneralStudyDetail): FormInput {
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

export function toRequest(values: FormOutput): StudyCreateUpdateRequest {
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
