import { zodResolver } from "@hookform/resolvers/zod";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { useNextStep } from "@join/hooks/useNextStep";
import { usePersonalInfoStore } from "@join/stores/personalInfoStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StudentDepartment } from "./field/studentDepartment";
import { StudentGrade } from "./field/studentGrade";
import { StudentId } from "./field/studentId";
import { StudentPhoneNumber } from "./field/studentPhoneNumber";
import StudentResidentNumber from "./field/studentResidentNumber";
import {
  fetchPersonalInfoData,
  submitPersonalInfoData,
} from "./PersonalInfo.Api";
import { transformFetchedDataToFormValues } from "./PersonalInfo.helper";
import {
  type PersonalInfoApiValues,
  type PersonalInfoFormValues,
  personalInfoSchema,
} from "./PersonalInfo.schema";

const PersonalInfo = () => {
  const { personalInfoData, setPersonalInfoData } = usePersonalInfoStore();
  const isInitial = personalInfoData === null;

  const handleSubmitWithTransform = async (
    formData: PersonalInfoFormValues
  ) => {
    // 주민등록번호로 성별 계산
    const gender = Number(formData.residentNumber_back) % 2 ? "MALE" : "FEMALE";

    // API에 보낼 데이터 가공
    const { residentNumber_back: _, ...rest } = formData;
    const apiData: PersonalInfoApiValues = { ...rest, gender };

    // 실제 API 호출 함수 실행
    return submitPersonalInfoData(apiData);
  };

  const { isLoading, handleSubmit } = useNextStep(handleSubmitWithTransform);

  const defaultValues = personalInfoData || {};

  const methods = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isInitial) {
      fetchPersonalInfoData()
        .then((data) => {
          const transformedData = transformFetchedDataToFormValues(data);
          setPersonalInfoData(transformedData);
          // 학년(grade)은 초기화에서 제외하고, 나머지 필드만 초기화
          const { grade: _omitGrade, ...rest } = transformedData;
          methods.reset(rest as Partial<PersonalInfoFormValues>);
        })
        .catch(console.error);
    }

    return () => {
      if (methods.formState.isDirty) {
        setPersonalInfoData(methods.getValues());
      }
    };
  }, [
    methods.reset,
    methods.getValues,
    setPersonalInfoData,
    methods.formState.isDirty,
    isInitial,
  ]);

  return (
    <FormProvider {...methods}>
      <form
        className="line-breaks space-y-4"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <StudentPhoneNumber name="phoneNumber" />
        <StudentId name="studentId" />
        <StudentResidentNumber />
        <StudentDepartment name="department" />
        <StudentGrade name="grade" />

        <NavigationButtons
          isVisuallyDisabled={!methods.formState.isValid}
          isLoading={isLoading}
        />
      </form>
    </FormProvider>
  );
};

export default PersonalInfo;
