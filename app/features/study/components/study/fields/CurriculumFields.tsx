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

const CurriculumFields = () => {
  const {
    form: {
      control,
      formState: { errors },
    },
    curriculumFieldArray,
  } = useStudyFormContext();

  const {
    fields: curriculumFields,
    append: appendCurriculum,
    remove: removeCurriculum,
  } = curriculumFieldArray;

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-gray-900 text-lg">
            커리큘럼
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendCurriculum({ value: "" })}
            className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
          >
            <Plus className="mr-1 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {curriculumFields.map(
          (field: { id: string; value: string }, index: number) => (
            <div key={field.id} className="flex items-center gap-2">
              <Controller
                name={`curriculum.${index}.value`}
                control={control}
                rules={{
                  required: "커리큘럼 내용을 입력하세요.",
                  validate: (value: string) =>
                    value.trim() !== "" || "커리큘럼 내용을 입력하세요.",
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder={"학습할 내용을 나열해주세요."}
                    className={
                      fieldState.invalid && fieldState.isDirty
                        ? "min-h-[40px] flex-1 resize-y border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "min-h-[40px] flex-1 resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }
                    aria-invalid={!!errors.curriculum?.[index]}
                  />
                )}
              />
              {curriculumFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCurriculum(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {errors.curriculum?.[index] && (
                <span className="ml-2 text-red-500 text-xs">
                  {(errors.curriculum[index] as FieldError)?.message ?? ""}
                </span>
              )}
            </div>
          )
        )}
        {errors.curriculum &&
          typeof (errors.curriculum as FieldError).message === "string" && (
            <span className="mt-1 block text-red-500 text-xs">
              {(errors.curriculum as FieldError).message}
            </span>
          )}
      </CardContent>
    </Card>
  );
};

export default CurriculumFields;
