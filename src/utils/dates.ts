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
  /** ISO-Datum für das <time datetime>-Attribut */
  datetime: string;
  label: string;
}

/**
 * Datumsspanne wie auf der Jekyll-Site (date_range.html):
 * - showDays: "28.–30. April 2026" / "28. April – 3. Mai 2026"
 * - sonst:    "April 2026" / "April/Mai 2026"
 * Rückgabe als Teile (time-Elemente) + Separator.
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

/** Langes deutsches Datum, z.B. "8. März 2026" (für Post-Meta). */
export function longDate(date: Date): string {
  return `${date.getDate()}. ${monthName(date)} ${date.getFullYear()}`;
}
