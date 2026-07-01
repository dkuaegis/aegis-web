import { getApiBaseUrl } from "@app/lib/apiBaseUrl";
import { useAuthStore } from "@join/stores/authStore";
import toast from "react-hot-toast";
import getErrorMessage from "./errorMessage";
import { HttpClient } from "./HttpClient";
import type { ServerError } from "./types";

const isDev = import.meta.env.MODE === "development";
const BASE_URL = getApiBaseUrl();

export const httpClient = new HttpClient(BASE_URL);

// reqeust 로깅
httpClient.interceptors.request.use((config) => {
  if (isDev) {
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// 401 리디렉션
httpClient.interceptors.response.use(
  (response) => response,
  (error: ServerError) => {
    if (error.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// 토스트 띄워주면 될듯. 지금은 alert로 대체
httpClient.interceptors.response.use(
  (response) => response,
  (error: ServerError) => {
    const message = getErrorMessage(error);
    if (message) {
      toast.error(message);
      console.error(message);
    }

    return Promise.reject(error);
  }
);
