const pad = (n: number) => String(n).padStart(2, "0");

export const startOfDay = (value: number | Date): number => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};
