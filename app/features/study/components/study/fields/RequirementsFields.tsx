import { useI18n } from "@app/i18n";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import { Textarea } from "@study/components/ui/textarea";
import { useStudyFormContext } from "@study/hooks/useStudyForm";
import { Plus, X } from "lucide-react";
import { Controller, type FieldError } from "react-hook-form";

const RequirementsFields = () => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const {
    form: {
      control,
      formState: { errors },
    },
    requirementFieldArray,
  } = useStudyFormContext();

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = requirementFieldArray;

  return (
    <fieldset className="repeat-fields">
      <legend>{t("study.form.requirementsSection")}</legend>
      {requirementFields.map(
        (item: { id: string; value: string }, index: number) => (
          <div key={item.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Controller
              name={`requirements.${index}.value`}
              control={control}
              rules={{
                required: t("study.form.requirementsRequired"),
                validate: (value: string) =>
                  value.trim() !== "" || t("study.form.requirementsRequired"),
              }}
              render={({ field, fieldState }) => (
                <Textarea
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  rows={1}
                  aria-label={`${t("study.form.requirementsSection")} ${index + 1}`}
                  className={
                    fieldState.invalid && fieldState.isDirty
                      ? "border-red-500"
                      : undefined
                  }
                  aria-invalid={!!errors.requirements?.[index]}
                />
              )}
            />
            <button
              className="icon-button"
              type="button"
              disabled={requirementFields.length === 1}
              aria-label={`${t("study.form.requirementsSection")} ${index + 1} ${ui("삭제", "Remove")}`}
              onClick={() => removeRequirement(index)}
            >
              <X aria-hidden="true" />
            </button>
            {errors.requirements?.[index] && (
              <span className="text-red-500 text-xs">
                {(errors.requirements[index] as FieldError)?.message ?? ""}
              </span>
            )}
          </div>
        )
      )}
      <button
        className="text-button"
        type="button"
        onClick={() => appendRequirement({ value: "" })}
      >
        <Plus aria-hidden="true" /> {ui("항목 추가", "Add item")}
      </button>
      {errors.requirements &&
        typeof (errors.requirements as FieldError).message === "string" && (
          <span className="text-red-500 text-xs">
            {(errors.requirements as FieldError).message}
          </span>
        )}
    </fieldset>
  );
};
export default RequirementsFields;
