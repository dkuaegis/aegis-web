import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import { Input } from "@study/components/ui/input";
import { Label } from "@study/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@study/components/ui/radio-group";
import { useStudyFormContext } from "@study/hooks/useStudyForm";
import { StudyRecruitmentMethod } from "@study/types/study";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";

const MAX_PARTICIPANTS = 50;
const MIN_PARTICIPANTS = 1;

const RecruitmentFields = () => {
  const {
    form: {
      control,
      formState: { isDirty },
      setValue,
    },
    isEditMode,
  } = useStudyFormContext();

  const maxParticipantsLimitType = useWatch({
    control,
    name: "maxParticipantsLimitType",
  });

  // "제한 없음"을 선택했을 때 maxParticipants를 "0"으로 설정
  useEffect(() => {
    if (maxParticipantsLimitType === "unlimited") {
      setValue("maxParticipants", "0", {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false,
      });
    }
  }, [maxParticipantsLimitType, setValue]);

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          모집 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditMode && (
          <div>
            <Label className="mb-3 block font-medium text-gray-900 text-sm">
              모집 방법
            </Label>
            <Controller
              name="recruitmentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={StudyRecruitmentMethod.FCFS}
                      id="first-come"
                    />
                    <Label
                      htmlFor="first-come"
                      className="cursor-pointer text-gray-700 text-sm"
                    >
                      선착순 모집
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={StudyRecruitmentMethod.APPLICATION}
                      id="application"
                    />
                    <Label
                      htmlFor="application"
                      className="cursor-pointer text-gray-700 text-sm"
                    >
                      지원서 심사
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        )}
        <div>
          <Label className="font-medium text-gray-900 text-sm">모집 인원</Label>
          <Controller
            name="maxParticipantsLimitType"
            control={control}
            defaultValue="unlimited"
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={field.value}
                onValueChange={field.onChange}
                className="mt-1 flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unlimited" id="unlimited" />
                  <Label
                    htmlFor="unlimited"
                    className="cursor-pointer text-gray-700 text-sm"
                  >
                    제한 없음
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label
                    htmlFor="limited"
                    className="cursor-pointer text-gray-700 text-sm"
                  >
                    제한 있음
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          <Controller
            name="maxParticipants"
            control={control}
            rules={{
              validate: (value) => {
                if (maxParticipantsLimitType !== "limited") return true;
                const numValue = Number(value);
                if (
                  !value ||
                  Number.isNaN(numValue) ||
                  !Number.isInteger(numValue) ||
                  numValue < MIN_PARTICIPANTS ||
                  numValue > MAX_PARTICIPANTS
                ) {
                  return "1~50명 사이로 입력하세요.";
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <>
                {maxParticipantsLimitType === "limited" && (
                  <div className="mt-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      id="maxParticipants"
                      type="number"
                      placeholder="최대 인원수"
                      className={
                        fieldState.invalid && isDirty
                          ? "w-20 border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }
                      min={MIN_PARTICIPANTS}
                      max={MAX_PARTICIPANTS}
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid ? "maxParticipants-error" : undefined
                      }
                    />
                    <span className="ml-2 text-gray-500 text-sm">명</span>
                  </div>
                )}
                {fieldState.invalid && (
                  <span
                    id="maxParticipants-error"
                    className="mt-1 block text-red-500 text-xs"
                    role="alert"
                  >
                    {fieldState.error?.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecruitmentFields;
