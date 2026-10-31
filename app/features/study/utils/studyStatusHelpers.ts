import type { StudyDetail } from "@study/types/study";

export const isStudyRecruiting = (study: StudyDetail): boolean => {
  return (
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0
  );
};
