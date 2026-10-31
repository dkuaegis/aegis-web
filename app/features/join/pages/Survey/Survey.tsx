import { ApiError, api } from "@app/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { useNextStep } from "@join/hooks/useNextStep";
import { useSurveyStore } from "@join/stores/surveyStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AcquisitionType } from "./Survey.AcquisitionType";
import JoinReason from "./Survey.JoinReason";
import { type SurveyFormValues, surveySchema } from "./Survey.schema";

const submitSurveyData = async (data: SurveyFormValues) => {
  return api.post("/survey", data);
};

const fetchSurveyData = () => api.get<SurveyFormValues>("/survey");

const Survey = () => {
  const { joinReason, acquisitionType, setFormValues } = useSurveyStore();
  const { isLoading, handleSubmit } = useNextStep(submitSurveyData);

  const defaultValues = {
    joinReason: joinReason || "",
    acquisitionType: acquisitionType || undefined,
  };

  const methods = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues,
  });

  // 새로고침했거나 나중에 다시 들어온 경우 서버에 저장된 응답으로 채웁니다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 처음 들어왔을 때 한 번만 확인합니다.
  useEffect(() => {
    if (joinReason || acquisitionType) return;
    let active = true;
    fetchSurveyData()
      .then((data) => {
        if (active && !methods.formState.isDirty) methods.reset(data);
      })
      .catch((error) => {
        // 아직 설문을 저장하지 않았다면 404가 정상입니다.
        if (!(error instanceof ApiError && error.status === 404)) {
          console.error("설문 정보를 불러오지 못했습니다:", error);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      setFormValues(methods.getValues());
    };
  }, [methods, setFormValues]);

  return (
    <FormProvider {...methods}>
      <form
        className="line-breaks space-y-4"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <AcquisitionType />
        <JoinReason />

        <NavigationButtons
          isVisuallyDisabled={!methods.formState.isValid}
          isLoading={isLoading}
        />
      </form>
    </FormProvider>
  );
};

export default Survey;
