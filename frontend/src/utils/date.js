export const ADELAIDE_TIME_ZONE = 'Australia/Adelaide';

export function getDateParts(date, timeZone = ADELAIDE_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  };
}

export function getDisplayDate(date = new Date(), timeZone = ADELAIDE_TIME_ZONE) {
  const { year, month, day } = getDateParts(date, timeZone);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDateKey(date, timeZone = ADELAIDE_TIME_ZONE) {
  const { year, month, day } = getDateParts(date, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getWeekStart(offset = 0, baseDate = getDisplayDate()) {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}
