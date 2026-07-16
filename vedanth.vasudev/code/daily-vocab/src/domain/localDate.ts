/** Format a Date as YYYY-MM-DD in the given IANA timezone (defaults to local). */
export function formatLocalDate(date: Date, timeZone?: string): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone ?? undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA yields YYYY-MM-DD
  return fmt.format(date);
}
