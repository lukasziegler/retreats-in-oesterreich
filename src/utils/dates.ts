const MONTHS = [
  "Jänner",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;

export function monthName(date: Date): string {
  return MONTHS[date.getMonth()]!;
}

export interface DateRangePart {
  /** ISO date for the <time datetime> attribute */
  datetime: string;
  label: string;
}

/**
 * Date range as on the Jekyll site (date_range.html):
 * - showDays: "28.–30. April 2026" / "28. April – 3. Mai 2026"
 * - otherwise: "April 2026" / "April/Mai 2026"
 * Returned as parts (time elements) + separator.
 */
export function dateRange(
  start: Date,
  end: Date,
  showDays = false,
): {
  parts: [DateRangePart] | [DateRangePart, DateRangePart];
  separator: string;
} {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (showDays) {
    if (sameMonth) {
      return {
        parts: [
          { datetime: iso(start), label: `${start.getDate()}.` },
          {
            datetime: iso(end),
            label: `${end.getDate()}. ${monthName(start)} ${start.getFullYear()}`,
          },
        ],
        separator: " – ",
      };
    }
    if (sameYear) {
      return {
        parts: [
          {
            datetime: iso(start),
            label: `${start.getDate()}. ${monthName(start)}`,
          },
          {
            datetime: iso(end),
            label: `${end.getDate()}. ${monthName(end)} ${start.getFullYear()}`,
          },
        ],
        separator: " – ",
      };
    }
    return {
      parts: [
        {
          datetime: iso(start),
          label: `${start.getDate()}. ${monthName(start)} ${start.getFullYear()}`,
        },
        {
          datetime: iso(end),
          label: `${end.getDate()}. ${monthName(end)} ${end.getFullYear()}`,
        },
      ],
      separator: " – ",
    };
  }

  if (sameMonth) {
    return {
      parts: [
        {
          datetime: iso(start),
          label: `${monthName(start)} ${start.getFullYear()}`,
        },
      ],
      separator: "",
    };
  }
  return {
    parts: [
      { datetime: iso(start), label: monthName(start) },
      { datetime: iso(end), label: `${monthName(end)} ${start.getFullYear()}` },
    ],
    separator: "/",
  };
}

/** Long German date, e.g. "8. März 2026" (for post meta). */
export function longDate(date: Date): string {
  return `${date.getDate()}. ${monthName(date)} ${date.getFullYear()}`;
}
