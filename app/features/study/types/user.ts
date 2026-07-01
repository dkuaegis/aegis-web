export interface UserStudyRoles {
  instructorStudyIds: number[];
  participantStudyIds: number[];
  appliedStudyIds: number[];
}

export enum UserRole {
  INSTRUCTOR = "INSTRUCTOR", // 스터디장
  PARTICIPANT = "PARTICIPANT", // 스터디원
  APPLICANT = "APPLICANT", // 지원자
  GUEST = "GUEST", // 일반 회원 (스터디와 무관)
}

export interface UserStudyInfo {
  studyId: number;
  role: UserRole;
  hasApplied: boolean;
  isInstructor: boolean;
  isParticipant: boolean;
}
