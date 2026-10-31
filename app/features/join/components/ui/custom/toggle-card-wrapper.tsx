import { cn } from "@app/lib/utils";
import type React from "react";

interface ToggleCardWrapperProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  children: React.ReactNode;
}

const ToggleCardWrapper = ({
  isSelected,
  className,
  children,
  ...props
}: ToggleCardWrapperProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-white p-4",
        // 살짝 튀어 오르는 이징으로 선택·호버 시 떠오르는 움직임을 표현합니다.
        "shadow-md transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none",
        isSelected
          ? "animate-aurora -translate-y-1 scale-105 border-[oklch(var(--primary)/0.5)] bg-[length:300%_500%] bg-gradient-to-r from-white via-[aliceblue] to-white shadow-[0_0_0_2px_rgb(240_248_255/0.5),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]"
          : "border-slate-200 bg-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default ToggleCardWrapper;
