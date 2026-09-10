import { useI18n } from "@app/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@study/components/ui/alert-dialog";
import type React from "react";

interface StudyConfirmationDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  isSubmitting: boolean;
  submitText: string;
  submittingText: string;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const StudyConfirmationDialog = ({
  children,
  onConfirm,
  isSubmitting,
  submitText,
  submittingText,
  title,
  description,
  open,
  onOpenChange,
}: StudyConfirmationDialogProps) => {
  const { t } = useI18n();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="study-dialog-content">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? t("study.form.createConfirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? t("study.form.createConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="group dialog-btn-cancel">
            <span aria-hidden="true" className="dialog-btn-ripple-container">
              <span aria-hidden="true" className="dialog-btn-ripple" />
            </span>
            <span className="dialog-btn-text">{t("common.cancel")}</span>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="group dialog-btn-confirm"
          >
            <span aria-hidden="true" className="dialog-btn-ripple-container">
              <span aria-hidden="true" className="dialog-btn-ripple" />
            </span>
            <span className="dialog-btn-text">
              {isSubmitting ? submittingText : submitText}
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudyConfirmationDialog;
