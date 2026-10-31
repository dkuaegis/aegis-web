import { getLanguage } from "@app/i18n/store";

function locale() {
  return getLanguage() === "en" ? "en-US" : "ko-KR";
}

/**
 * Parses the server's `LocalDate` ("2026-10-31") or `LocalDateTime`
 * ("2026-10-31T18:30:00") as local time. `new Date("2026-10-31")` would
 * read a bare date as UTC and can land on the previous day.
 */
export function parseServerDate(value: string): Date {
  const [datePart, timePart = "00:00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(/[:.]/).map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Intl.DateTimeFormat(locale(), options).format(
    parseServerDate(value)
  );
}

export function formatDateTime(value: string): string {
  return formatDate(value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale()).format(value);
}
