import { useI18n } from "@app/i18n";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Label } from "@join/components/ui/label";
import { Textarea } from "@join/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import type { SurveyFormValues } from "./Survey.schema";

const JoinReason = () => {
  const { t } = useI18n();
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  return (
    <div className="space-y-2">
      <Label htmlFor="joinReason" className="flex items-end text-base">
        {t("join.survey.joinReasonLabel")}
      </Label>
      <Textarea
        id="joinReason"
        className="join-reason-textarea"
        rows={8}
        placeholder={t("join.survey.joinReasonPlaceholder")}
        maxLength={510}
        {...register("joinReason")}
      />
      <ErrorMessage
        isShown={!!errors.joinReason}
        message={errors.joinReason?.message}
      />
    </div>
  );
};

export default JoinReason;
