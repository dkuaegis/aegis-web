import { getApiBaseUrl } from "@app/lib/apiBaseUrl";
import axios from "axios";

export const mypageApiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

export function getAxiosErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    return `HTTP ${error.response?.status ?? ""} ${error.response?.statusText ?? ""}`.trim();
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
