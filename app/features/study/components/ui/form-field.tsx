import { Label } from "@radix-ui/react-label";
import {
  Controller,
  type ControllerRenderProps,
  type FieldError,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface IProps {
  name: string;
  label: string;
  required?: boolean;
  rules?: RegisterOptions;
  children: (
    field: ControllerRenderProps & {
      id: string;
      "aria-invalid": boolean;
      "aria-describedby"?: string;
    },
    meta: {
      hasError: boolean;
      isDirty: boolean;
    }
  ) => React.ReactElement;
}

const FormField = ({ name, label, required, children, rules }: IProps) => {
  const {
    control,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const errorId = `${name}-error`;

  return (
    <div>
      <Label htmlFor={name} className="font-medium text-gray-900 text-sm">
        {label} {required && "*"}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) =>
          children(
            {
              ...field,
              id: name,
              "aria-invalid": !!error,
              "aria-describedby": error ? errorId : undefined,
            },
            {
              hasError: !!error,
              isDirty: !!dirtyFields[name],
            }
          )
        }
      />
      {error && (
        <span id={errorId} className="mt-1 block text-red-500 text-xs">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormField;
