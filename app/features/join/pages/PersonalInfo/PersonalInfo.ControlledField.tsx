import type {
  FieldValues,
  Path,
  UseControllerProps,
  UseControllerReturn,
} from "react-hook-form";
import { type Control, useController, useFormContext } from "react-hook-form";

interface UseControllerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>, // TName을 Path<TFieldValues>로 제한
> extends Pick<
    UseControllerProps<TFieldValues, TName>,
    "name" | "defaultValue" | "rules"
  > {}

export const useControllerField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>, // TName을 Path<TFieldValues>로 제한
>(
  props: UseControllerFieldProps<TFieldValues, TName>
): UseControllerReturn<TFieldValues, TName> & {
  error: string | undefined;
  control: Control<TFieldValues>;
  isValid: boolean;
} => {
  const { control, formState } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController<TFieldValues, TName>({
    // UseController에 타입 명시
    ...props,
    control,
  });

  const isValid = !fieldState.error;

  return {
    field,
    fieldState,
    formState,
    control,
    isValid,
    error: fieldState.error?.message,
  };
};
