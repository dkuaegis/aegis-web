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

/**
 * 표시 이름은 언어별 사전에서 가져옵니다. 아래 헬퍼들은 enum 값에서
 * 사전 키를 만들어 주므로, 키 문자열이 코드 곳곳에 흩어지지 않습니다.
 */
export const studyCategoryLabelKey = (category: StudyCategory) =>
  `study.labels.categories.${category}`;

export enum StudyLevel {
  BASIC = "BASIC", // 입문
  EASY = "EASY", // 초급
  INTERMEDIATE = "INTERMEDIATE", // 중급
  ADVANCED = "ADVANCED", // 고급
}

export const studyLevelLabelKey = (level: StudyLevel) =>
  `study.labels.levels.${level}`;

export enum StudyRecruitmentMethod {
  FCFS = "FCFS", // 선착순
  APPLICATION = "APPLICATION", // 지원서
}

export const studyRecruitmentMethodLabelKey = (
  method: StudyRecruitmentMethod
) => `study.labels.recruitmentMethods.${method}`;

/** 상세 화면에서 쓰는 더 긴 표현("선착순 모집" 등). */
export const studyRecruitmentMethodLongLabelKey = (
  method: StudyRecruitmentMethod
) => `study.labels.recruitmentMethodsLong.${method}`;

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const applicationStatusLabelKey = (status: ApplicationStatus) =>
  `study.labels.applicationStatus.${status}`;

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
