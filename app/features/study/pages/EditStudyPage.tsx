import { useI18n } from "@app/i18n";
import {
  type StudyFormData,
  useUpdateStudyMutation,
} from "@study/api/editStudyApi";
import { useStudyDetailQuery } from "@study/api/studyDetailApi";
import StudyFormContent from "@study/components/study/StudyFormContent";
import Header from "@study/components/ui/Header";
import { useToast } from "@study/components/ui/useToast";
import { StudyFormProvider } from "@study/hooks/useStudyForm";
import { useUserRole } from "@study/hooks/useUserRole";
import ForbiddenPage from "@study/pages/ForbiddenPage";
import type { StudyRecruitmentMethod } from "@study/types/study";

interface EditStudyProps {
  studyId: number;
  onBack: () => void;
}

interface FormValues {
  title: string;
  category: string;
  difficulty: string;
  introduction: string;
  recruitmentMethod: StudyRecruitmentMethod;
  maxParticipants: string;
  maxParticipantsLimitType?: string;
  schedule: string;
  curriculum: { value: string }[];
  requirements: { value: string }[];
}

const EditStudyPage = ({ studyId, onBack }: EditStudyProps) => {
  const { t } = useI18n();
  const toast = useToast();

  // 사용자 역할 확인
  const {
    isInstructor,
    isLoading: isRoleLoading,
    error: roleError,
  } = useUserRole();

  // 권한 확인 - 강사만 스터디를 수정할 수 있음
  const isOwner = isInstructor(studyId);

  // 스터디 정보를 로드할 수 있는지 확인
  const canLoad = !isRoleLoading && isOwner;

  const {
    data: study,
    isLoading: isStudyLoading,
    isError,
  } = useStudyDetailQuery(studyId, { enabled: canLoad });

  // 로딩 상태 처리
  const isLoading = isStudyLoading || isRoleLoading;

  const mapFormValuesToStudyData = (formValues: FormValues): StudyFormData => {
    return {
      title: formValues.title,
      category: formValues.category,
      difficulty: formValues.difficulty,
      introduction: formValues.introduction,
      recruitmentMethod: formValues.recruitmentMethod,
      maxParticipants: formValues.maxParticipants,
      schedule: formValues.schedule,
      curriculum: formValues.curriculum,
      requirements: formValues.requirements,
    };
  };

  const handleSuccess = () => {
    toast({ description: t("study.form.editSuccess") });
    onBack();
  };

  const handleError = (error?: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : t("study.form.editError");
    toast({
      description: message,
    });
  };

  const updateMutation = useUpdateStudyMutation(
    studyId,
    handleSuccess,
    handleError
  );

  const handleUpdate = (formValues: FormValues) => {
    const payload: StudyFormData = mapFormValuesToStudyData(formValues);
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">
            {isRoleLoading
              ? t("study.loading.role")
              : t("study.loading.study")}
          </div>
        </div>
      </div>
    );
  }

  if (roleError) {
    console.error("사용자 권한 조회 오류:", roleError);
    // 권한 오류 시에도 기본 권한으로 계속 진행
  }

  // 권한이 없는 경우
  if (!isOwner) {
    return (
      <ForbiddenPage
        message={t("study.forbidden.edit")}
        onBack={onBack}
      />
    );
  }

  if (isError || !study) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-500">{t("study.form.editLoadError")}</div>
        </div>
      </div>
    );
  }

  const initialValues: FormValues = {
    title: study.title,
    category: study.category,
    difficulty: study.level,
    introduction: study.description,
    recruitmentMethod: study.recruitmentMethod,
    maxParticipants: study.maxParticipants.toString(),
    maxParticipantsLimitType:
      study.maxParticipants === 0 ? "unlimited" : "limited",
    schedule: study.schedule,
    curriculum: (Array.isArray(study.curricula) ? study.curricula : []).map(
      (v) => ({ value: v })
    ),
    requirements: (Array.isArray(study.qualifications)
      ? study.qualifications
      : []
    ).map((v) => ({
      value: v,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={onBack} />

      <div className="mx-auto max-w-4xl p-6">
        <StudyFormProvider
          isEditMode={true}
          initialValues={initialValues}
          onComplete={({ formData }) => handleUpdate(formData)}
        >
          <StudyFormContent
            onCancel={onBack}
            submitText={t("study.form.editSubmit")}
            submittingText={t("study.form.editSubmitting")}
          />
        </StudyFormProvider>
      </div>
    </div>
  );
};

export default EditStudyPage;
