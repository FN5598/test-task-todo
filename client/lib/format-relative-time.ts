const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const timeUnits = [
  { unit: "year" as const, milliseconds: 365 * 24 * 60 * 60 * 1_000 },
  { unit: "month" as const, milliseconds: 30 * 24 * 60 * 60 * 1_000 },
  { unit: "week" as const, milliseconds: 7 * 24 * 60 * 60 * 1_000 },
  { unit: "day" as const, milliseconds: 24 * 60 * 60 * 1_000 },
  { unit: "hour" as const, milliseconds: 60 * 60 * 1_000 },
  { unit: "minute" as const, milliseconds: 60 * 1_000 },
];

export function formatRelativeTime(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const elapsedMilliseconds = Date.now() - date.getTime();

  if (Math.abs(elapsedMilliseconds) < 60 * 1_000) {
    return "just now";
  }

  for (const { unit, milliseconds } of timeUnits) {
    if (Math.abs(elapsedMilliseconds) >= milliseconds) {
      return relativeTimeFormatter.format(-Math.round(elapsedMilliseconds / milliseconds), unit);
    }
  }

  return "just now";
}
