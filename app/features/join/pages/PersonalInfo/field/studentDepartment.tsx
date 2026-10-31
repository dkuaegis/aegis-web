import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { Button } from "@join/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@join/components/ui/command";
import { ErrorMessage } from "@join/components/ui/custom/error-message";
import { Label } from "@join/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@join/components/ui/popover";
import {
  DEPARTMENT_VALUES,
  departmentLabel,
} from "@join/constants/departments";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentDepartmentProps {
  name: string;
}

export const StudentDepartment = ({
  name,
  ...props
}: StudentDepartmentProps) => {
  const { t, language } = useI18n();
  const [open, setOpen] = useState(false);
  const { field, error, isValid } = useControllerField({ name });

  const selectedLabel = field.value
    ? departmentLabel(field.value, language)
    : t("join.personalInfo.departmentPlaceholder");

  return (
    <div className="space-y-2" {...props}>
      <Label htmlFor="department">
        {t("join.personalInfo.departmentLabel")}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              id="department"
              variant="outline-form"
              type="button"
              aria-invalid={!isValid}
              className={cn(
                "w-full text-lg",
                !field.value && "text-muted-foreground"
              )}
            >
              <span className="min-w-0 flex-1 truncate text-left">
                {selectedLabel}
              </span>
              <ChevronsUpDown className="size-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0"
        >
          <Command>
            <CommandInput
              placeholder={t("join.personalInfo.departmentSearchPlaceholder")}
            />
            <CommandList>
              <CommandEmpty>
                {t("join.personalInfo.departmentEmpty")}
              </CommandEmpty>
              <CommandGroup>
                {DEPARTMENT_VALUES.map((departmentValue) => {
                  const label = departmentLabel(departmentValue, language);

                  return (
                    <CommandItem
                      key={departmentValue}
                      // Filtering happens on `value`, so it holds the label the
                      // visitor can actually read. `keywords` keeps the Korean
                      // name searchable in either language, and selection uses
                      // the captured API value rather than whatever cmdk echoes
                      // back.
                      value={label}
                      keywords={[departmentValue]}
                      onSelect={() => {
                        field.onChange(departmentValue);
                        setOpen(false);
                      }}
                      className="items-start"
                    >
                      {field.value === departmentValue ? (
                        <Check className="mt-0.5 mr-2 h-4 w-4" />
                      ) : (
                        <div className="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1 whitespace-normal break-words">
                        {label}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ErrorMessage
        isShown={!!error && !isValid}
        message={t("join.personalInfo.departmentError")}
      />
    </div>
  );
};
