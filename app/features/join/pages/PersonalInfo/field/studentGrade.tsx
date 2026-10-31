import { useI18n } from "@app/i18n";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Label } from "@join/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@join/components/ui/select";
import { GRADE_VALUES } from "@join/constants/grades";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentGradeProps {
  name: string;
}

export const StudentGrade = ({ name, ...props }: StudentGradeProps) => {
  const { t } = useI18n();
  const { field, error, isValid } = useControllerField({ name });

  return (
    <div className="space-y-2" {...props}>
      <Label htmlFor="grade">{t("join.personalInfo.gradeLabel")}</Label>
      <Select value={field.value ?? ""} onValueChange={field.onChange}>
        <SelectTrigger
          id="grade"
          aria-invalid={!isValid}
          className="h-12 w-full text-lg"
        >
          <SelectValue placeholder={t("join.personalInfo.gradePlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {GRADE_VALUES.map((grade) => (
            <SelectItem key={grade} value={grade}>
              {t(`join.personalInfo.grades.${grade}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorMessage
        isShown={!!error && !isValid}
        message={t("join.personalInfo.gradeError")}
      />
    </div>
  );
};
