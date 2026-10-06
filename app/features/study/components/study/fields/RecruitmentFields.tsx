import { useI18n } from "@app/i18n";
import { Input } from "@study/components/ui/input";
import { useStudyUiText } from "@study/components/ui/StudyLayout";
import { useStudyFormContext } from "@study/hooks/useStudyForm";
import { StudyRecruitmentMethod } from "@study/types/study";
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";

const MAX_PARTICIPANTS = 50;
const MIN_PARTICIPANTS = 1;

const RecruitmentFields = () => {
  const { t } = useI18n();
  const ui = useStudyUiText();
  const {
    form: {
      control,
      formState: { isDirty },
      setValue,
    },
    isEditMode,
  } = useStudyFormContext();

  const maxParticipantsLimitType = useWatch({
    control,
    name: "maxParticipantsLimitType",
  });

  // "제한 없음"을 선택했을 때 maxParticipants를 "0"으로 설정
  useEffect(() => {
    if (maxParticipantsLimitType === "unlimited") {
      setValue("maxParticipants", "0", {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false,
      });
    }
  }, [maxParticipantsLimitType, setValue]);

  return (
    <div className="field-grid two-columns">
      <Controller
        name="maxParticipantsLimitType"
        control={control}
        defaultValue="unlimited"
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <div className="field">
        <label htmlFor="recruitment-method">
          {ui("모집 방식", "Recruitment method")}
        </label>
        <Controller
          name="recruitmentMethod"
          control={control}
          render={({ field }) => (
            <select {...field} id="recruitment-method" disabled={isEditMode}>
              <option value={StudyRecruitmentMethod.FCFS}>
                {ui("선착순", "First come, first served")}
              </option>
              <option value={StudyRecruitmentMethod.APPLICATION}>
                {ui("지원서 검토", "Application review")}
              </option>
            </select>
          )}
        />
      </div>
      <div className="field">
        <label htmlFor="maxParticipants">
          {ui("정원 (0은 제한없음)", "Capacity (0 for unlimited)")}
        </label>
        <Controller
          name="maxParticipants"
          control={control}
          rules={{
            validate: (value) => {
              if (maxParticipantsLimitType !== "limited") return true;
              const numValue = Number(value);
              if (
                !value ||
                Number.isNaN(numValue) ||
                !Number.isInteger(numValue) ||
                numValue < MIN_PARTICIPANTS ||
                numValue > MAX_PARTICIPANTS
              )
                return t("study.form.participantsRange");
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={
                  field.value ||
                  (maxParticipantsLimitType !== "limited" ? "0" : "")
                }
                id="maxParticipants"
                type="number"
                min={0}
                max={MAX_PARTICIPANTS}
                onChange={(event) => {
                  setValue(
                    "maxParticipantsLimitType",
                    event.target.value === "0" ? "unlimited" : "limited",
                    { shouldDirty: true }
                  );
                  field.onChange(event);
                }}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "maxParticipants-error" : undefined
                }
                className={
                  fieldState.invalid && isDirty ? "border-red-500" : undefined
                }
              />
              {fieldState.invalid && (
                <span
                  id="maxParticipants-error"
                  className="text-red-500 text-xs"
                  role="alert"
                >
                  {fieldState.error?.message}
                </span>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};
export default RecruitmentFields;
