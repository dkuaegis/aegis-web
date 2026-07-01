import { getApiBaseUrl } from "@app/lib/apiBaseUrl";
import { useAuthStore } from "@study/stores/useAuthStore";
import axios, {
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

type ApiClientOptions = AxiosRequestConfig & {
  json?: unknown;
  throwHttpErrors?: boolean;
};

type ResponseLike<T = unknown> = {
  ok: boolean;
  status: number;
  headers: {
    get: (name: string) => string | null;
  };
  json: <Data = T>() => Promise<Data>;
};

type ResponsePromise<T = unknown> = Promise<ResponseLike<T>> & {
  json: <Data = T>() => Promise<Data>;
};

export class HTTPError extends Error {
  response: ResponseLike;

  constructor(response: ResponseLike) {
    super(`HTTP Error: ${response.status}`);
    this.name = "HTTPError";
    this.response = response;
  }
}

export type TimeoutError = DOMException;

const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

function getHeaderValue(headers: AxiosResponse["headers"], name: string) {
  if (headers instanceof AxiosHeaders) {
    return headers.get(name)?.toString() ?? null;
  }

  const value = headers[name.toLowerCase()] ?? headers[name];
  if (Array.isArray(value)) return value.join(", ");
  return value?.toString() ?? null;
}

function toResponseLike<T>(response: AxiosResponse<T>): ResponseLike<T> {
  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    headers: {
      get: (name: string) => getHeaderValue(response.headers, name),
    },
    json: async <Data = T>() => response.data as unknown as Data,
  };
}

function createResponsePromise<T>(
  promise: Promise<ResponseLike<T>>
): ResponsePromise<T> {
  const responsePromise = promise as ResponsePromise<T>;
  responsePromise.json = async <Data = T>() => {
    const response = await promise;
    return response.json<Data>();
  };
  return responsePromise;
}

function request<T>(
  method: AxiosRequestConfig["method"],
  url: string,
  options: ApiClientOptions = {}
): ResponsePromise<T> {
  const { json, throwHttpErrors = true, ...config } = options;

  const promise = axiosClient
    .request<T>({
      ...config,
      method,
      url,
      data: json,
    })
    .then((response) => toResponseLike(response))
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          useAuthStore.getState().setUnauthorized();
        }

        const response = toResponseLike(error.response);
        if (!throwHttpErrors) {
          return response;
        }
        throw new HTTPError(response);
      }
      throw error;
    });

  return createResponsePromise(promise);
}

export const apiClient = {
  get: <T = unknown>(url: string, options?: ApiClientOptions) =>
    request<T>("GET", url, options),
  post: <T = unknown>(url: string, options?: ApiClientOptions) =>
    request<T>("POST", url, options),
  put: <T = unknown>(url: string, options?: ApiClientOptions) =>
    request<T>("PUT", url, options),
  patch: <T = unknown>(url: string, options?: ApiClientOptions) =>
    request<T>("PATCH", url, options),
  delete: <T = unknown>(url: string, options?: ApiClientOptions) =>
    request<T>("DELETE", url, options),
};
