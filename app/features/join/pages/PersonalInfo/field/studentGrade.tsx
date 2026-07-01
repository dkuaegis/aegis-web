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

//학년 필드 배열
const grades = [
  { value: "ONE", label: "1학년" },
  { value: "TWO", label: "2학년" },
  { value: "THREE", label: "3학년" },
  { value: "FOUR", label: "4학년" },
  { value: "FIVE", label: "5학년" },
];

interface StudentGradeProps {
  name: string; // name prop 추가
}

export const StudentGrade = forwardRef<HTMLDivElement, StudentGradeProps>(
  ({ name, ...props }, ref) => {
    const { field, error, isValid } = useControllerField({ name });

    return (
      <div className="space-y-2" {...props} ref={ref}>
        <Label htmlFor="grade">학년</Label>
        <Select value={field.value ?? ""} onValueChange={field.onChange}>
          <SelectTrigger
            aria-invalid={!isValid}
            className="h-12 w-full text-lg"
          >
            <SelectValue placeholder="학년 선택" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade.value} value={grade.value}>
                {grade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage
          isShown={!!error && !isValid}
          message="학년을 선택해주세요"
        />
      </div>
    );
  }
);

StudentGrade.displayName = "StudentGrade";
