const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const relativeTimeUnits = [
  ["year", 365 * 24 * 60 * 60 * 1_000],
  ["month", 30 * 24 * 60 * 60 * 1_000],
  ["week", 7 * 24 * 60 * 60 * 1_000],
  ["day", 24 * 60 * 60 * 1_000],
  ["hour", 60 * 60 * 1_000],
  ["minute", 60 * 1_000],
] as const;

export function formatRelativeTime(value: string | Date, now = Date.now()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const millisecondsUntil = date.getTime() - now;

  if (Math.abs(millisecondsUntil) < 60 * 1_000) {
    return "just now";
  }

  for (const [unit, milliseconds] of relativeTimeUnits) {
    if (Math.abs(millisecondsUntil) >= milliseconds) {
      return relativeTimeFormatter.format(
        Math.round(millisecondsUntil / milliseconds),
        unit,
      );
    }
  }

  return "just now";
}
