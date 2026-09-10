import { useI18n } from "@app/i18n";
import StudyConfirmationDialog from "@study/components/study/StudyConfirmationDialog";
import StudyFormFields from "@study/components/study/StudyFormFields";
import { Button } from "@study/components/ui/button";
import { useStudyFormContext } from "@study/hooks/useStudyForm";
import { useState } from "react";

interface StudyFormContentProps {
  onCancel: () => void;
  submitText: string;
  submittingText: string;
}

const StudyFormContent = ({
  onCancel,
  submitText,
  submittingText,
}: StudyFormContentProps) => {
  const { t } = useI18n();
  const { form, onSubmit, isEditMode } = useStudyFormContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <form
      className="study-form"
      onSubmit={form.handleSubmit(() => setConfirmOpen(true))}
    >
      <StudyFormFields />
      <div className="study-form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="group form-btn-cancel"
        >
          <span aria-hidden="true" className="dialog-btn-ripple-container">
            <span aria-hidden="true" className="dialog-btn-ripple" />
          </span>
          <span className="dialog-btn-text">{t("common.cancel")}</span>
        </Button>
        <StudyConfirmationDialog
          onConfirm={form.handleSubmit(onSubmit)}
          isSubmitting={form.formState.isSubmitting}
          submitText={submitText}
          submittingText={submittingText}
          title={
            isEditMode
              ? t("study.form.editConfirmTitle")
              : t("study.form.createConfirmTitle")
          }
          description={
            isEditMode
              ? t("study.form.editConfirmDescription")
              : t("study.form.createConfirmDescription")
          }
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
        >
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            className="group form-btn-submit"
          >
            <span aria-hidden="true" className="dialog-btn-ripple-container">
              <span aria-hidden="true" className="dialog-btn-ripple" />
            </span>
            <span className="dialog-btn-text">
              {form.formState.isSubmitting ? submittingText : submitText}
            </span>
          </Button>
        </StudyConfirmationDialog>
      </div>
    </form>
  );
};

export default StudyFormContent;
