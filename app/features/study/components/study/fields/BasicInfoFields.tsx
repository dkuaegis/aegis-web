import { useI18n } from "@app/i18n";

import FormField from "@study/components/ui/form-field";
import { Input } from "@study/components/ui/input";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import { Textarea } from "@study/components/ui/textarea";
import { useStudyFormContext } from "@study/hooks/useStudyForm";

const INTRODUCTION_MAX_LENGTH = 1000;
const TITLE_MAX_LENGTH = 30;

const BasicInfoFields = () => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const { difficulties, categories } = useStudyFormContext();

  return (
    <div className="study-basic-fields">
      <FormField
        name="title"
        label={t("study.form.titleLabel")}
        required
        rules={{
          required: t("study.form.titleRequired"),
          maxLength: {
            value: TITLE_MAX_LENGTH,
            message: t("study.form.titleMaxLength", {
              max: TITLE_MAX_LENGTH,
            }),
          },
        }}
      >
        {(field, { hasError, isDirty }) => (
          <Input
            {...field}
            maxLength={TITLE_MAX_LENGTH}
            className={
              hasError && isDirty
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
          />
        )}
      </FormField>
      <div className="field-grid two-columns">
        <FormField
          name="category"
          label={t("study.form.categoryLabel")}
          required
          rules={{ required: t("study.form.categoryRequired") }}
        >
          {(field, { hasError, isDirty }) => (
            <select
              {...field}
              className={hasError && isDirty ? "border-red-500" : undefined}
            >
              <option value="" disabled>
                {t("study.form.categoryPlaceholder")}
              </option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField
          name="difficulty"
          label={t("study.form.difficultyLabel")}
          required
          rules={{ required: t("study.form.difficultyRequired") }}
        >
          {(field, { hasError, isDirty }) => (
            <select
              {...field}
              className={hasError && isDirty ? "border-red-500" : undefined}
            >
              <option value="" disabled>
                {t("study.form.difficultyPlaceholder")}
              </option>
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          )}
        </FormField>
      </div>
      <FormField
        name="introduction"
        label={ui("소개", "Introduction")}
        required
        rules={{
          required: t("study.form.introductionRequired"),
          maxLength: {
            value: INTRODUCTION_MAX_LENGTH,
            message: t("study.form.introductionMaxLength", {
              max: INTRODUCTION_MAX_LENGTH,
            }),
          },
        }}
      >
        {(field, { hasError, isDirty }) => (
          <>
            <Textarea
              {...field}
              rows={7}
              maxLength={INTRODUCTION_MAX_LENGTH}
              className={
                hasError && isDirty
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
            />
            <small>
              {String(field.value ?? "").length} / {INTRODUCTION_MAX_LENGTH}
            </small>
          </>
        )}
      </FormField>
    </div>
  );
};

export default BasicInfoFields;
