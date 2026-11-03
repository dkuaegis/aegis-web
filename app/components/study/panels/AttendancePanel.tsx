import { Button } from "@app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@app/components/ui/field";
import { CodeField } from "@app/components/ui/otp-field";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { type ActionResult, useActionDialog } from "@app/lib/actions";
import { KeyRoundIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Panel } from "./Panel";

export function AttendancePanel({ attendedToday }: { attendedToday: boolean }) {
  const { t } = useI18n();
  return (
    <Panel heading={t("study.labels.roles.participant")}>
      <div className="grid gap-2">
        <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
          {t("study.attendance.heading")}
        </p>
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {attendedToday
            ? t("study.attendance.attendedToday")
            : t("study.attendance.prompt")}
        </p>
      </div>
      {!attendedToday && <AttendanceDialog />}
    </Panel>
  );
}

const CODE_PATTERN = /^\d{4}$/;

/**
 * The code is typed in a dialog: digit boxes have a natural size, and the
 * side panel's width changes with the screen.
 */
function AttendanceDialog() {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { fetcher, busy, failed, dialog } = useActionDialog<ActionResult>({
    onOpen: () => {
      setCode("");
      setTouched(false);
    },
    onResult: (result) => {
      if (result.ok) return;
      // The boxes were disabled while sending; clear them and put the caret
      // back so the next try can be typed straight away.
      setCode("");
      requestAnimationFrame(() =>
        formRef.current?.querySelector("input")?.focus()
      );
    },
  });
  const valid = CODE_PATTERN.test(code);

  const submit = (value: string) => {
    setTouched(true);
    if (!CODE_PATTERN.test(value)) return;
    fetcher.submit({ intent: "attend", code: value }, { method: "post" });
  };

  const error =
    touched && !valid && code
      ? t("study.attendance.invalid")
      : code
        ? null
        : failed;

  return (
    <Dialog {...dialog}>
      <DialogTrigger
        render={
          <Button size="lg" variant="ink" className="w-full">
            <KeyRoundIcon aria-hidden="true" />
            {t("study.attendance.open")}
          </Button>
        }
      />
      <DialogContent
        className="max-w-sm text-center"
        // Straight to the first box, so phones raise the number pad.
        initialFocus={() => formRef.current?.querySelector("input") ?? true}
      >
        <form
          ref={formRef}
          noValidate
          className="grid gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit(code);
          }}
        >
          <DialogHeader className="px-0 text-balance">
            <DialogTitle>{t("study.attendance.dialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("study.attendance.description")}
            </DialogDescription>
          </DialogHeader>
          <Field invalid={Boolean(error)}>
            <FieldLabel className="sr-only">
              {t("study.attendance.label")}
            </FieldLabel>
            <CodeField
              length={4}
              className="justify-center"
              value={code}
              onValueChange={(value) => {
                setCode(value);
                if (touched) setTouched(false);
              }}
              onValueComplete={submit}
              disabled={busy}
              slotLabel={(index) =>
                t("study.attendance.slot", { index: index + 1, length: 4 })
              }
            />
            {error && (
              <FieldError className="justify-center">{error}</FieldError>
            )}
          </Field>
          <Button type="submit" size="lg" variant="ink" disabled={busy}>
            {busy && <Spinner />}
            {t("study.attendance.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
