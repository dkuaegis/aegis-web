import { useI18n } from "@app/i18n";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Input } from "@join/components/ui/input";
import { Label } from "@join/components/ui/label";
import { useControllerField } from "../PersonalInfo.ControlledField";

const StudentResidentNumber = () => {
  const { t } = useI18n();
  const {
    field: birthDateField,
    error: birthDateError,
    isValid: isBirthDateValid,
  } = useControllerField({ name: "birthDate" });

  const {
    field: residentNumberBackField,
    error: residentNumberBackError,
    isValid: isResidentNumberBackValid,
  } = useControllerField({ name: "residentNumber_back" });

  return (
    <div className="space-y-2">
      <Label htmlFor="registrationNumber">
        {t("join.personalInfo.residentNumberLabel")}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id="registrationNumber"
          type="text"
          inputMode="numeric"
          placeholder={t("join.personalInfo.birthDatePlaceholder")}
          className="h-12 text-left text-base"
          maxLength={6}
          aria-invalid={!isBirthDateValid}
          value={birthDateField.value || ""}
          onChange={birthDateField.onChange}
          onBlur={birthDateField.onBlur}
          ref={birthDateField.ref}
        />
        <span className="font-bold text-gray-400 text-xl">-</span>
        <Input
          type="text"
          inputMode="numeric"
          className="h-12 w-16 text-center text-base"
          maxLength={1}
          aria-label={t("join.personalInfo.residentNumberBackLabel")}
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
        message={t("join.personalInfo.residentNumberError")}
      />
    </div>
  );
};

export default StudentResidentNumber;
