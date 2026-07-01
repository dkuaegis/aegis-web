import { cn } from "@join/lib/utils";
import type * as React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  onValueChange?: (value: string) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onValueChange, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle<
      HTMLTextAreaElement,
      HTMLTextAreaElement
    >(forwardedRef, () => {
      if (!internalRef.current) {
        throw new Error("Text area Ref error");
      }
      return internalRef.current;
    }, []);

    const adjustHeight = useCallback((e: HTMLTextAreaElement) => {
      requestAnimationFrame(() => {
        e.style.height = "auto";
        e.style.height = `${e.scrollHeight}px`;
      });
    }, []);

    const handleChange = useCallback(
      (e: React.InputEvent<HTMLTextAreaElement>) => {
        adjustHeight(e.currentTarget);
        const newValue = e.currentTarget.value;
        onValueChange?.(newValue);
      },
      [adjustHeight, onValueChange]
    );

    useEffect(() => {
      if (internalRef.current) {
        adjustHeight(internalRef.current);
      }
    }, [adjustHeight]);

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onInput={handleChange}
        ref={internalRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
