import { useI18n } from "@app/i18n";
import StudyFormContent from "@study/components/study/StudyFormContent";
import StudyLayout, { useStudyUiText } from "@study/components/ui/StudyLayout";
import { useToast } from "@study/components/ui/useToast";
import { StudyFormProvider } from "@study/hooks/useStudyForm";
import { useNavigate } from "react-router-dom";

const CreateStudyPage = () => {
  const { t } = useI18n();
  const ui = useStudyUiText();
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
    <StudyLayout
      onBack={handleBack}
      backLabel={ui("스터디 목록", "Study list")}
      title={ui("새 스터디 개설", "Create a new study")}
    >
      <StudyFormProvider
        onComplete={({ mode }) => {
          if (mode === "create") {
            handleSuccess();
          }
        }}
      >
        <StudyFormContent
          onCancel={handleBack}
          submitText={ui("스터디 개설", "Create study")}
          submittingText={t("study.form.createSubmitting")}
        />
      </StudyFormProvider>
    </StudyLayout>
  );
};

export default CreateStudyPage;
