import StudyFormContent from "@study/components/study/StudyFormContent";
import Header from "@study/components/ui/Header";
import { useToast } from "@study/components/ui/useToast";
import { StudyFormProvider } from "@study/hooks/useStudyForm";
import { useNavigate } from "react-router-dom";

const CreateStudyPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleBack = () => {
    navigate("/study");
  };

  const handleSuccess = () => {
    toast({ description: "스터디가 성공적으로 개설되었습니다!" });
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
            submitText="스터디 개설하기"
            submittingText="개설 중..."
          />
        </StudyFormProvider>
      </div>
    </div>
  );
};

export default CreateStudyPage;
