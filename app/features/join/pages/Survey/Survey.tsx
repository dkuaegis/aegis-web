import { zodResolver } from "@hookform/resolvers/zod";
import { httpClient } from "@join/api/api";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { useNextStep } from "@join/hooks/useNextStep";
import { useSurveyStore } from "@join/stores/surveyStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AcquisitionType } from "./Survey.AcquisitionType";
import JoinReason from "./Survey.JoinReason";
import { type SurveyFormValues, surveySchema } from "./Survey.schema";

const submitSurveyData = async (data: SurveyFormValues) => {
  return httpClient.post("/survey", data);
};

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
