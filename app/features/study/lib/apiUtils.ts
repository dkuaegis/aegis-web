import { HTTPError } from "@study/lib/apiClient";

export function handleHTTPError(
  error: unknown,
  errorMessages: Record<number | "default", string>
): never {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    const message = (status && errorMessages[status]) || errorMessages.default;
    throw new Error(message);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(`${errorMessages.default}: ${String(error)}`);
}
