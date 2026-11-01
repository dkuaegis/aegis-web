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

/** "2026.09.04", the same in every language so list columns line up. */
export function formatDate(value: string): string {
  const date = parseServerDate(value);
  return `${date.getFullYear()}.${formatMonthDay(value)}`;
}

/** "09.04", for dates that all fall in one semester. */
export function formatMonthDay(value: string): string {
  const date = parseServerDate(value);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** "2026.09.04 18:27" */
export function formatDateTime(value: string): string {
  const date = parseServerDate(value);
  return `${formatDate(value)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "2026년 9월 4일 오후 6:27", for a date inside a sentence. */
export function formatDateTimeInText(value: string): string {
  return new Intl.DateTimeFormat(locale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parseServerDate(value));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale()).format(value);
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
