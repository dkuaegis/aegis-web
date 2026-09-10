import { useI18n } from "@app/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import FormField from "@study/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@study/components/ui/select";
import { Textarea } from "@study/components/ui/textarea";
import { useStudyFormContext } from "@study/hooks/useStudyForm";

const INTRODUCTION_MAX_LENGTH = 1000;
const TITLE_MAX_LENGTH = 30;

const BasicInfoFields = () => {
  const { t } = useI18n();
  const { difficulties, categories } = useStudyFormContext();

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {t("study.form.basicInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Textarea
              {...field}
              maxLength={TITLE_MAX_LENGTH}
              placeholder={t("study.form.titlePlaceholder")}
              className={
                hasError && isDirty
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
            />
          )}
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="category"
            label={t("study.form.categoryLabel")}
            required
            rules={{ required: t("study.form.categoryRequired") }}
          >
            {(field, { hasError, isDirty }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                name={field.name}
              >
                <SelectTrigger
                  ref={field.ref}
                  id={field.id}
                  onBlur={field.onBlur}
                  aria-invalid={field["aria-invalid"]}
                  aria-describedby={field["aria-describedby"]}
                  className={
                    hasError && isDirty
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }
                >
                  <SelectValue
                    placeholder={t("study.form.categoryPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField
            name="difficulty"
            label={t("study.form.difficultyLabel")}
            required
            rules={{ required: t("study.form.difficultyRequired") }}
          >
            {(field, { hasError, isDirty }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                name={field.name}
              >
                <SelectTrigger
                  ref={field.ref}
                  id={field.id}
                  onBlur={field.onBlur}
                  aria-invalid={field["aria-invalid"]}
                  aria-describedby={field["aria-describedby"]}
                  className={
                    hasError && isDirty
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }
                >
                  <SelectValue
                    placeholder={t("study.form.difficultyPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>
        <FormField
          name="introduction"
          label={t("study.form.introductionLabel")}
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
            <Textarea
              {...field}
              maxLength={INTRODUCTION_MAX_LENGTH}
              placeholder={t("study.form.introductionPlaceholder")}
              className={
                hasError && isDirty
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
            />
          )}
        </FormField>
      </CardContent>
    </Card>
  );
};

export default BasicInfoFields;
