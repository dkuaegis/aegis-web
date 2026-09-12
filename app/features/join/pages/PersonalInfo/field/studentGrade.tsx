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
import { forwardRef } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

/** API가 기대하는 학년 값. 표시 이름은 언어별 사전에서 가져옵니다. */
const GRADE_VALUES = ["ONE", "TWO", "THREE", "FOUR", "FIVE"] as const;

interface StudentGradeProps {
  name: string;
}

export const StudentGrade = forwardRef<HTMLDivElement, StudentGradeProps>(
  ({ name, ...props }, ref) => {
    const { t } = useI18n();
    const { field, error, isValid } = useControllerField({ name });

    return (
      <div className="space-y-2" {...props} ref={ref}>
        <Label htmlFor="grade">{t("join.personalInfo.gradeLabel")}</Label>
        <Select value={field.value ?? ""} onValueChange={field.onChange}>
          <SelectTrigger
            aria-invalid={!isValid}
            className="h-12 w-full text-lg"
          >
            <SelectValue
              placeholder={t("join.personalInfo.gradePlaceholder")}
            />
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
  }
);

StudentGrade.displayName = "StudentGrade";
