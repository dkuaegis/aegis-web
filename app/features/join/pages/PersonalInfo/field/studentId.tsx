import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Input } from "@join/components/ui/input";
import { Label } from "@join/components/ui/label";
import { forwardRef, useCallback } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentIdProps {
  name: string;
}
export const StudentId = forwardRef<HTMLInputElement, StudentIdProps>(
  ({ name, ...props }, ref) => {
    const { field, error, isValid } = useControllerField({ name });

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // 숫자만 입력받도록 처리
        let value = event.target.value.replace(/[^0-9]/g, "");

        // 최대 8자리까지만 허용
        if (value.length > 8) {
          value = value.slice(0, 8);
        }

        field.onChange(value); // 변경된 값 적용
      },
      [field.onChange]
    );

    return (
      <div className="space-y-2">
        <Label htmlFor="studentId">학번</Label>
        <Input
          type="text"
          id="studentId"
          placeholder="32000000"
          maxLength={8}
          ref={ref}
          aria-invalid={!isValid}
          value={field.value || ""}
          onChange={handleInputChange}
          {...props}
        />
        <ErrorMessage
          isShown={!!error && !isValid}
          message="학번은 32로 시작하는 8자리 숫자여야 합니다"
        />
      </div>
    );
  }
);
