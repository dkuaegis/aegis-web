import { useI18n } from "@app/i18n";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Input } from "@join/components/ui/input";
import { Label } from "@join/components/ui/label";
import { formatPhoneNumber } from "@join/pages/PersonalInfo/PersonalInfo.helper";
import { useCallback } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentPhoneNumberProps
  extends React.ComponentPropsWithoutRef<"input"> {
  name: string; // name prop 추가
}

export const StudentPhoneNumber = ({
  name,
  ...props
}: StudentPhoneNumberProps) => {
  const { t } = useI18n();
  const { field, error, isValid } = useControllerField({ name });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // 타입 명시
      const rawValue = event.target.value;
      const formattedValue = formatPhoneNumber(rawValue);
      field.onChange(formattedValue);
    },
    [field.onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="phoneNumber">{t("join.personalInfo.phoneLabel")}</Label>
      <Input
        type="tel"
        id="phoneNumber"
        placeholder={t("join.personalInfo.phonePlaceholder")}
        aria-invalid={!isValid}
        value={field.value || ""}
        onChange={handleInputChange}
        maxLength={13} // 010-1234-5678
        {...props}
      />
      <ErrorMessage
        isShown={!!error && !isValid}
        message={t("join.personalInfo.phoneError")}
      />
    </div>
  );
};
