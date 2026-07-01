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
  title = "스터디 개설 확인",
  description = "정말로 개설하시겠습니까?",
  open,
  onOpenChange,
}: StudyConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="study-dialog-content">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="group dialog-btn-cancel">
            <span aria-hidden="true" className="dialog-btn-ripple-container">
              <span aria-hidden="true" className="dialog-btn-ripple" />
            </span>
            <span className="dialog-btn-text">취소</span>
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
