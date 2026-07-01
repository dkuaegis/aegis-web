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
import { departments } from "@join/constants/departments";
import { cn } from "@join/lib/utils";
import type { Department } from "@join/types/api/member";
import { Check, ChevronsUpDown } from "lucide-react";
import { forwardRef, useState } from "react";
import { useControllerField } from "../PersonalInfo.ControlledField";

interface StudentDepartmentProps {
  name: string; // name prop 추가
}

export const StudentDepartment = forwardRef<
  HTMLDivElement,
  StudentDepartmentProps
>(({ name, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { field, error, isValid } = useControllerField({ name });

  const defaultDepartmentLabel =
    departments.find((dept) => dept.value === field.value)?.label ||
    "학과 선택";

  // CommandItem 스타일(검색창)
  const commandItemStyle = {
    whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
    overflow: "hidden", // 넘치는 텍스트 숨김
    textOverflow: "ellipsis", // 말줄임표 표시
  };

  return (
    <div className="space-y-2" {...props} ref={ref}>
      <Label htmlFor="department">소속</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              variant="outline-form"
              type="button"
              aria-invalid={!isValid}
              className={cn(
                "w-full text-lg",
                !field.value && "text-muted-foreground" // 선택된 값이 없을 때만 적용될 스타일
              )}
            >
              {defaultDepartmentLabel}
              <ChevronsUpDown className="size-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="학과를 검색해주세요." />
            <CommandList>
              <CommandEmpty>존재하지 않는 학과입니다.</CommandEmpty>
              <CommandGroup>
                {departments.map((departmentItem) => (
                  <CommandItem
                    key={departmentItem.value}
                    value={departmentItem.value}
                    onSelect={(currentValue) => {
                      field.onChange(currentValue as Department);
                      setOpen(false);
                    }}
                    style={commandItemStyle}
                  >
                    {field.value === departmentItem.value ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <div className="mr-2 h-4 w-4" />
                    )}
                    {departmentItem.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ErrorMessage
        isShown={!!error && !isValid}
        message="학과를 선택해주세요"
      />
    </div>
  );
});

StudentDepartment.displayName = "StudentDepartment";
