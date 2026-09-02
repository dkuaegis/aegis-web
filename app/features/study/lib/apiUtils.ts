import { ApiError } from "@app/lib/api";

export function handleHTTPError(
  error: unknown,
  errorMessages: Record<number | "default", string>
): never {
  if (error instanceof ApiError) {
    const status = error.status;
    const message = (status && errorMessages[status]) || errorMessages.default;
    throw new Error(message);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(`${errorMessages.default}: ${String(error)}`);
}
