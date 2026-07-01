import axios, { type AxiosInstance } from "axios";
import {
  type HttpRequestConfig,
  type HttpResponse,
  type RequestInterceptor,
  type ResponseInterceptor,
  ServerError,
} from "./types";

interface Interceptors {
  request: RequestInterceptor[];
  // biome-ignore lint/suspicious/noExplicitAny: <This is intentionally an array of mixed-type interceptors>
  response: ResponseInterceptor<any>[];
}

export class HttpClient {
  private _interceptors: Interceptors = {
    request: [],
    response: [],
  };

  private _client: AxiosInstance;

  constructor(baseURL = "") {
    this._client = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  public get interceptors() {
    return {
      request: {
        use: (
          onFulfilled: (
            config: HttpRequestConfig
          ) => HttpRequestConfig | Promise<HttpRequestConfig>,
          onRejected?: (error: unknown) => Promise<never>
        ) => {
          this._interceptors.request.push({ onFulfilled, onRejected });
        },
      },
      response: {
        use: <SuccessType = unknown>(
          onFulfilled: (
            response: HttpResponse<SuccessType>
          ) => HttpResponse<SuccessType> | Promise<HttpResponse<SuccessType>>,
          onRejected?: (error: ServerError) => Promise<never>
        ) => {
          this._interceptors.response.push({ onFulfilled, onRejected });
        },
      },
    };
  }

  private async request<T>(config: HttpRequestConfig): Promise<T> {
    let currentConfig = config;

    for (const interceptor of this._interceptors.request) {
      try {
        currentConfig = await interceptor.onFulfilled(currentConfig);
      } catch (error) {
        if (interceptor.onRejected) {
          return interceptor.onRejected(error);
        }
        return Promise.reject(error);
      }
    }

    try {
      const response = await this._client.request<T>(currentConfig);

      let processedResponse: HttpResponse<T> = {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };

      for (const interceptor of this._interceptors.response) {
        if (interceptor.onFulfilled) {
          processedResponse = await interceptor.onFulfilled(processedResponse);
        }
      }

      return processedResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = new ServerError({
          status: error.response.status,
          headers: error.response.headers,
          url: currentConfig.url,
          method: currentConfig.method?.toUpperCase() ?? "GET",
        });

        const errorInterceptorChain = this._interceptors.response.reduce(
          (promise, interceptor) => {
            if (interceptor.onRejected) {
              return promise.catch(interceptor.onRejected);
            }
            return promise;
          },
          Promise.reject(serverError)
        );

        return errorInterceptorChain;
      }
      return Promise.reject(error);
    }
  }

  private async _requestWithBody<T>(
    method: "POST" | "PUT" | "PATCH",
    url: string,
    data?: unknown,
    config?: Omit<HttpRequestConfig, "url" | "method" | "data">
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      ...config?.headers,
    };
    return this.request<T>({
      ...config,
      method,
      url,
      data,
      headers,
    });
  }

  public async get<T>(
    url: string,
    config?: Omit<HttpRequestConfig, "url" | "method">
  ): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: Omit<HttpRequestConfig, "url" | "method" | "data">
  ): Promise<T> {
    return this._requestWithBody("POST", url, data, config);
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: Omit<HttpRequestConfig, "url" | "method" | "data">
  ): Promise<T> {
    return this._requestWithBody("PUT", url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: Omit<HttpRequestConfig, "url" | "method">
  ): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}
