const pad = (n: number) => String(n).padStart(2, "0");

const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

export const startOfDay = (value: number | Date): number => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

export const parseDate = (value: string): number | null => {
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date.getTime();
};
