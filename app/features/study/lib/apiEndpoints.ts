export const API_ENDPOINTS = {
  STUDIES: "studies",
  CHECK_AUTH: "auth/check",
  STUDY_APPLICATIONS: (studyId: number) =>
    `studies/${studyId}/applications-instructor`,
  APPLICATION_DETAIL: (studyId: number, applicationId: number) =>
    `studies/${studyId}/applications/${applicationId}`,
  APPROVE_APPLICATION: (studyId: number, applicationId: number) =>
    `studies/${studyId}/applications/${applicationId}/approve`,
  REJECT_APPLICATION: (studyId: number, applicationId: number) =>
    `studies/${studyId}/applications/${applicationId}/reject`,
  STUDY_ENROLLMENT: (studyId: number) => `studies/${studyId}/enrollment`,
  STUDY_STATUS: (studyId: number) => `studies/${studyId}/applications/status`,
  // 사용자 지원서 관련 엔드포인트
  USER_APPLICATION: (studyId: number) => `studies/${studyId}/applications`,
  STUDY_MEMBERS_INSTRUCTOR: (studyId: number) =>
    `studies/${studyId}/members-instructor`,
} as const;
