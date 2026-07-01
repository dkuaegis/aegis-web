import type {
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";

export interface HttpRequestConfig extends AxiosRequestConfig {
  url: string;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
}

// 2025.08.11 기준 에러 발생시 상태코드로만 판별하기로 함. 에러 코드는 없기 때문에 고려하여 작성. 추후 서버 변경에 따라 달라져야 할 수 있음.
export class ServerError extends Error {
  readonly status: number;
  readonly headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  readonly url: string;
  readonly method: string;

  constructor(response: {
    status: number;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    url: string;
    method: string;
  }) {
    super(
      `Server error! status: ${response.status} for ${response.method || "GET"} ${response.url}`
    );
    this.name = "ServerError";
    this.status = response.status;
    this.headers = response.headers;
    this.url = response.url;
    this.method = response.method;
  }
}

export interface RequestInterceptor {
  onFulfilled: (
    config: HttpRequestConfig
  ) => HttpRequestConfig | Promise<HttpRequestConfig>;
  onRejected?: (error: unknown) => Promise<never>;
}

export interface ResponseInterceptor<T = unknown> {
  onFulfilled: (
    response: HttpResponse<T>
  ) => HttpResponse<T> | Promise<HttpResponse<T>>;
  onRejected?: (error: ServerError) => Promise<never>;
}
