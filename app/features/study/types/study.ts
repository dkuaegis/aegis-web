export enum StudyCategory {
  LANGUAGE = "LANGUAGE", // 언어
  WEB = "WEB", // 웹 개발
  APPLICATION = "APPLICATION", // 앱 개발
  GAME = "GAME", // 게임
  SECURITY = "SECURITY", // 보안
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE", // CS
  ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE", // AI
  DATA_SCIENCE = "DATA_SCIENCE", // 데이터
  ETC = "ETC", // 기타
}

export const StudyCategoryLabels: Record<StudyCategory, string> = {
  [StudyCategory.LANGUAGE]: "언어",
  [StudyCategory.WEB]: "웹 개발",
  [StudyCategory.APPLICATION]: "앱 개발",
  [StudyCategory.GAME]: "게임",
  [StudyCategory.SECURITY]: "보안",
  [StudyCategory.COMPUTER_SCIENCE]: "CS",
  [StudyCategory.ARTIFICIAL_INTELLIGENCE]: "AI",
  [StudyCategory.DATA_SCIENCE]: "데이터",
  [StudyCategory.ETC]: "기타",
};

export enum StudyLevel {
  BASIC = "BASIC", // 입문
  EASY = "EASY", // 초급
  INTERMEDIATE = "INTERMEDIATE", // 중급
  ADVANCED = "ADVANCED", // 고급
}

export const StudyLevelLabels: Record<StudyLevel, string> = {
  [StudyLevel.BASIC]: "입문",
  [StudyLevel.EASY]: "초급",
  [StudyLevel.INTERMEDIATE]: "중급",
  [StudyLevel.ADVANCED]: "고급",
};

export enum StudyRecruitmentMethod {
  FCFS = "FCFS", // 선착순
  APPLICATION = "APPLICATION", // 지원서
}

export const StudyRecruitmentMethodLabels: Record<
  StudyRecruitmentMethod,
  string
> = {
  [StudyRecruitmentMethod.FCFS]: "선착순",
  [StudyRecruitmentMethod.APPLICATION]: "지원서",
};

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "심사중",
  [ApplicationStatus.APPROVED]: "승인됨",
  [ApplicationStatus.REJECTED]: "거절됨",
};

// 편의를 위한 타입 유니온들
export type ApplicationStatusType = ApplicationStatus;
export type UserApplicationStatus = ApplicationStatus | null;

export interface StudyListItem {
  id: number;
  title: string;
  category: StudyCategory;
  level: StudyLevel;
  participantCount: number;
  maxParticipants: number;
  schedule: string;
  instructor: string;
}

export interface StudyDetail {
  id: number;
  title: string;
  category: StudyCategory;
  level: StudyLevel;
  description: string;
  recruitmentMethod: StudyRecruitmentMethod;
  participantCount: number;
  maxParticipants: number;
  schedule: string;
  curricula: string[];
  qualifications: string[];
  instructor: string;
}

// Application related types
export interface Application {
  id: number;
  name: string;
  phone: string;
  studentNumber: string;
  status: ApplicationStatus;
  applicationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyData {
  studyTitle: string;
  recruitmentMethod: StudyRecruitmentMethod;
  applications: Application[];
}
