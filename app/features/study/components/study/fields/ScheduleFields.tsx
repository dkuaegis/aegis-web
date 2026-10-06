import { useI18n } from "@app/i18n";
import FormField from "@study/components/ui/form-field";
import { Input } from "@study/components/ui/input";
import { useStudyUiText } from "@study/components/ui/StudyLayout";

const SCHEDULE_MAX_LENGTH = 100;

const ScheduleFields = () => {
  const { t } = useI18n();
  const ui = useStudyUiText();

  return (
    <FormField
      name="schedule"
      label={ui("진행 일정", "Schedule")}
      rules={{
        maxLength: {
          value: SCHEDULE_MAX_LENGTH,
          message: t("study.form.scheduleMaxLength", {
            max: SCHEDULE_MAX_LENGTH,
          }),
        },
      }}
    >
      {(field, { hasError, isDirty }) => (
        <Input
          {...field}
          maxLength={SCHEDULE_MAX_LENGTH}
          placeholder={ui(
            "매주 수요일 18:00~20:00",
            "Every Wednesday, 18:00–20:00"
          )}
          className={
            hasError && isDirty
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
        />
      )}
    </FormField>
  );
};

export default ScheduleFields;
