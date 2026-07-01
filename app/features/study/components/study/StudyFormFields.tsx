import BasicInfoFields from "./fields/BasicInfoFields";
import CurriculumFields from "./fields/CurriculumFields";
import RecruitmentFields from "./fields/RecruitmentFields";
import RequirementsFields from "./fields/RequirementsFields";
import ScheduleFields from "./fields/ScheduleFields";

const StudyFormFields = () => {
  return (
    <>
      <BasicInfoFields />
      <RecruitmentFields />
      <ScheduleFields />
      <CurriculumFields />
      <RequirementsFields />
    </>
  );
};

export default StudyFormFields;
