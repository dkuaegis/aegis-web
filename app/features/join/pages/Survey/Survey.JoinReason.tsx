import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Label } from "@join/components/ui/label";
import { Textarea } from "@join/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import type { SurveyFormValues } from "./Survey.schema";

const JoinReason = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  return (
    <div className="space-y-2">
      <Label htmlFor="joinReason" className="flex items-end text-base">
        가입 이유{" "}
      </Label>
      <Textarea
        id="joinReason"
        className="join-reason-textarea"
        rows={8}
        placeholder="동아리에서 어떤 활동을 하고 싶으신가요? 자유롭게 작성해주세요!"
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
