export enum AuthStatus {
  UNAUTHORIZED = "UNAUTHORIZED", // 인증 안됨 (401)
  NOT_COMPLETED = "NOT_COMPLETED", // 가입 완료 안됨
  COMPLETED = "COMPLETED", // 가입 완료
  LOADING = "LOADING",
}
