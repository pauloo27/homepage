export function withLeadingZeroes(number: number, size: number): string {
  let str = number.toString();
  while (str.length < size) str = `0${str}`;
  return str;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = withLeadingZeroes(date.getMonth() + 1, 2);
  const day = withLeadingZeroes(date.getDate(), 2);
  return `${year}-${month}-${day}`;
}
