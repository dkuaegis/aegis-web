import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Input } from "@join/components/ui/input";
import { Label } from "@join/components/ui/label";
import { forwardRef } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

const StudentResidentNumber = forwardRef<HTMLDivElement>((props, ref) => {
  const {
    field: birthDateField,
    error: birthDateError,
    isValid: isBirthDateValid,
  } = useControllerField({ name: "birthDate" });

  const {
    field: residentNumberBackField, // 2. 변수 이름도 명확하게 바꿔줍니다.
    error: residentNumberBackError,
    isValid: isResidentNumberBackValid,
  } = useControllerField({ name: "residentNumber_back" });

  return (
    <div className="space-y-2" ref={ref} {...props}>
      <Label htmlFor="registrationNumber">주민등록번호</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="생년월일 6자리"
          className="h-12 text-left text-base"
          maxLength={6}
          aria-invalid={!isBirthDateValid}
          value={birthDateField.value || ""}
          onChange={birthDateField.onChange}
          onBlur={birthDateField.onBlur}
          ref={birthDateField.ref} // ref도 연결해줍니다.
        />
        <span className="font-bold text-gray-400 text-xl">-</span>
        <Input
          type="text"
          inputMode="numeric"
          className="h-12 w-16 text-center text-base"
          maxLength={1}
          aria-invalid={!isResidentNumberBackValid}
          // 항상 제어 컴포넌트가 되도록 value를 문자열로 강제
          value={residentNumberBackField.value ?? ""}
          onChange={residentNumberBackField.onChange}
          onBlur={residentNumberBackField.onBlur}
          ref={residentNumberBackField.ref}
        />
        <div className="flex space-x-1">
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: The list is static and will not reorder.
            <div key={i} className="h-3 w-3 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>
      <ErrorMessage
        isShown={!!birthDateError || !!residentNumberBackError}
        message="유효하지 않은 주민등록번호입니다"
      />
    </div>
  );
});

export default StudentResidentNumber;
