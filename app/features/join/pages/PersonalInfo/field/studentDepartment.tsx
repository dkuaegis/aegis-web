import { useI18n } from "@app/i18n";
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
  departmentLabelKey,
} from "@join/constants/departments";
import { cn } from "@join/lib/utils";
import type { Department } from "@join/types/api/member";
import { Check, ChevronsUpDown } from "lucide-react";
import { forwardRef, useState } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentDepartmentProps {
  name: string;
}

export const StudentDepartment = forwardRef<
  HTMLDivElement,
  StudentDepartmentProps
>(({ name, ...props }, ref) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { field, error, isValid } = useControllerField({ name });

  const selectedLabel = field.value
    ? t(departmentLabelKey(field.value))
    : t("join.personalInfo.departmentPlaceholder");

  // 학과명이 길어 한 줄을 넘기므로 말줄임표로 처리합니다.
  const commandItemStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div className="space-y-2" {...props} ref={ref}>
      <Label htmlFor="department">{t("join.personalInfo.departmentLabel")}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              variant="outline-form"
              type="button"
              aria-invalid={!isValid}
              className={cn(
                "w-full text-lg",
                !field.value && "text-muted-foreground"
              )}
            >
              {selectedLabel}
              <ChevronsUpDown className="size-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
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
                  const label = t(departmentLabelKey(departmentValue));

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
                        field.onChange(departmentValue as Department);
                        setOpen(false);
                      }}
                      style={commandItemStyle}
                    >
                      {field.value === departmentValue ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <div className="mr-2 h-4 w-4" />
                      )}
                      {label}
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
});

StudentDepartment.displayName = "StudentDepartment";
