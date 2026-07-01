import apiClient from "./client";

export type AuthStatus = "PENDING" | "COMPLETED";

export interface AuthCheckResponse {
  status: AuthStatus;
}

export interface AuthUser {
  isAuthenticated: boolean;
  status: AuthStatus | null;
}

export async function checkAuth(): Promise<AuthUser> {
  try {
    const response = await apiClient.get<AuthCheckResponse>("/auth/check");
    return {
      isAuthenticated: true,
      status: response.data.status,
    };
  } catch {
    return {
      isAuthenticated: false,
      status: null,
    };
  }
}
