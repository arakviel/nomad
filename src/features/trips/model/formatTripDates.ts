const MONTHS_UK_SHORT = [
  'січ.',
  'лют.',
  'бер.',
  'квіт.',
  'трав.',
  'черв.',
  'лип.',
  'серп.',
  'вер.',
  'жовт.',
  'лист.',
  'груд.',
] as const;

function dayMonth(d: Date): string {
  return `${d.getDate()} ${MONTHS_UK_SHORT[d.getMonth()]}`;
}

/**
 * Людський підпис періоду, як у mock-стрічці:
 * «12–14 бер. 2026» або «28 бер. – 2 квіт. 2026».
 */
export function formatTripDateLabel(start: Date, end: Date): string {
  const y1 = start.getFullYear();
  const y2 = end.getFullYear();
  const m1 = start.getMonth();
  const m2 = end.getMonth();
  const d1 = start.getDate();
  const d2 = end.getDate();

  if (y1 === y2 && m1 === m2) {
    if (d1 === d2) {
      return `${dayMonth(start)} ${y1}`;
    }
    return `${d1}–${d2} ${MONTHS_UK_SHORT[m1]} ${y1}`;
  }

  if (y1 === y2) {
    return `${dayMonth(start)} – ${dayMonth(end)} ${y1}`;
  }

  return `${dayMonth(start)} ${y1} – ${dayMonth(end)} ${y2}`;
}
