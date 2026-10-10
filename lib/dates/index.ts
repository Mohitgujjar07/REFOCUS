/**
 * Formats a Date object or ISO string to YYYY-MM-DD
 */
export function formatToIsoDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a human-friendly format, e.g. "Saturday, 10 October 2026"
 */
export function formatDisplayDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Returns a short format, e.g. "Sat, 10 Oct"
 */
export function formatShortDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Returns day of week name (e.g. "Monday")
 */
export function getDayOfWeekName(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
