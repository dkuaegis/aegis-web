import { useI18n } from "@app/i18n";
import StudyFormContent from "@study/components/study/StudyFormContent";
import Header from "@study/components/ui/Header";
import { useToast } from "@study/components/ui/useToast";
import { StudyFormProvider } from "@study/hooks/useStudyForm";
import { useNavigate } from "react-router-dom";

const CreateStudyPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();

  const handleBack = () => {
    navigate("/study");
  };

  const handleSuccess = () => {
    toast({ description: t("study.form.createSuccess") });
    handleBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={handleBack} />

      <div className="mx-auto max-w-4xl p-6">
        <StudyFormProvider
          onComplete={({ mode }) => {
            if (mode === "create") {
              handleSuccess();
            }
          }}
        >
          <StudyFormContent
            onCancel={handleBack}
            submitText={t("study.form.createSubmit")}
            submittingText={t("study.form.createSubmitting")}
          />
        </StudyFormProvider>
      </div>
    </div>
  );
};

export default CreateStudyPage;
