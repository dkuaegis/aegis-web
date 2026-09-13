import { useI18n } from "@app/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import FormField from "@study/components/ui/form-field";
import { Input } from "@study/components/ui/input";
import { Calendar } from "lucide-react";

const SCHEDULE_MAX_LENGTH = 100;

const ScheduleFields = () => {
  const { t } = useI18n();

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {t("study.form.scheduleSection")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          name="schedule"
          label={t("study.form.scheduleLabel")}
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
            <div className="mt-1 flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                {...field}
                maxLength={SCHEDULE_MAX_LENGTH}
                placeholder={t("study.form.schedulePlaceholder")}
                className={
                  hasError && isDirty
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }
              />
            </div>
          )}
        </FormField>
      </CardContent>
    </Card>
  );
};

export default ScheduleFields;
