import { Button } from "@app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { useI18n } from "@app/i18n";
import { type ActionResult, useFetcherResult } from "@app/lib/actions";
import { cn } from "@app/lib/utils";
import { useState } from "react";
import { useFetcher } from "react-router";

/** Matches `StudyEnrollRequest.applicationReason` on the server. */
export const APPLICATION_REASON_MAX = 500;

interface ApplicationDialogProps {
  intent: "enroll" | "update-application";
  defaultReason: string;
  trigger: React.ReactElement;
}

/**
 * Writes or edits an application. Stays open until the server accepted it,
 * and shows the server's reason in place when it did not.
 */
export function ApplicationDialog({
  intent,
  defaultReason,
  trigger,
}: ApplicationDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(defaultReason);
  const [touched, setTouched] = useState(false);
  const fetcher = useFetcher<ActionResult>({ key: intent });
  const busy = fetcher.state !== "idle";
  const editing = intent === "update-application";

  const trimmed = reason.trim();
  const clientError = !trimmed
    ? t("study.application.required")
    : reason.length > APPLICATION_REASON_MAX
      ? t("study.application.tooLong", { max: APPLICATION_REASON_MAX })
      : null;
  const serverError =
    fetcher.data?.ok === false && !busy ? fetcher.data.message : null;
  const error = (touched && clientError) || serverError;

  useFetcherResult(fetcher, (result) => {
    if (!result.ok) return;
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        if (next) {
          setReason(defaultReason);
          setTouched(false);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-xl">
        <fetcher.Form
          method="post"
          noValidate
          className="grid gap-6"
          onSubmit={(event) => {
            setTouched(true);
            if (clientError) event.preventDefault();
          }}
        >
          <input type="hidden" name="intent" value={intent} />
          <DialogHeader>
            <DialogTitle>
              {t(
                editing
                  ? "study.application.editTitle"
                  : "study.application.title"
              )}
            </DialogTitle>
            <DialogDescription>
              {t("study.application.description")}
            </DialogDescription>
          </DialogHeader>

          <Field invalid={Boolean(error)}>
            <div className="flex items-baseline justify-between gap-4">
              <FieldLabel required>{t("study.application.label")}</FieldLabel>
              <span
                className={cn(
                  "tabular text-[0.75rem] font-[650] text-ink-subtle",
                  reason.length > APPLICATION_REASON_MAX && "text-danger"
                )}
              >
                {reason.length} / {APPLICATION_REASON_MAX}
              </span>
            </div>
            <Textarea
              name="applicationReason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t("study.application.placeholder")}
              aria-invalid={Boolean(error) || undefined}
              className="min-h-48"
            />
            {error ? (
              <FieldError>{error}</FieldError>
            ) : (
              !editing && (
                <FieldDescription>
                  {t("study.application.privacy")}
                </FieldDescription>
              )
            )}
          </Field>

          <DialogFooter>
            <DialogClose
              disabled={busy}
              render={<Button variant="outline">{t("common.cancel")}</Button>}
            />
            <Button type="submit" disabled={busy}>
              {busy && <Spinner />}
              {t(
                editing ? "study.application.save" : "study.application.submit"
              )}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
