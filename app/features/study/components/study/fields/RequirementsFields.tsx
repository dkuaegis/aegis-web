import { Button } from "@study/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@study/components/ui/card";
import { Textarea } from "@study/components/ui/textarea";
import { useStudyFormContext } from "@study/hooks/useStudyForm";
import { Plus, X } from "lucide-react";
import type { FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";

const RequirementsFields = () => {
  const {
    form: {
      control,
      formState: { errors },
    },
    requirementFieldArray,
  } = useStudyFormContext();

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = requirementFieldArray;

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-gray-900 text-lg">
            지원 자격
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendRequirement({ value: "" })}
            className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
          >
            <Plus className="mr-1 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {requirementFields.map(
          (field: { id: string; value: string }, index: number) => (
            <div key={field.id} className="flex items-center gap-2">
              <Controller
                name={`requirements.${index}.value`}
                control={control}
                rules={{
                  required: "지원 자격 조건을 입력하세요.",
                  validate: (value: string) =>
                    value.trim() !== "" || "지원 자격 조건을 입력하세요.",
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="지원 자격 조건을 입력하세요"
                    className={
                      fieldState.invalid && fieldState.isDirty
                        ? "min-h-[40px] flex-1 resize-y border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "min-h-[40px] flex-1 resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }
                    aria-invalid={!!errors.requirements?.[index]}
                  />
                )}
              />
              {requirementFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {errors.requirements?.[index] && (
                <span className="ml-2 text-red-500 text-xs" role="alert">
                  {(errors.requirements[index] as FieldError)?.message ?? ""}
                </span>
              )}
            </div>
          )
        )}
        {errors.requirements &&
          typeof (errors.requirements as FieldError).message === "string" && (
            <span className="mt-1 block text-red-500 text-xs" role="alert">
              {(errors.requirements as FieldError).message}
            </span>
          )}
      </CardContent>
    </Card>
  );
};

export default RequirementsFields;
