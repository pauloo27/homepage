export function withLeadingZeroes(number: number, size: number): string {
  let str = number.toString();

  while (str.length < size) {
    str = `0${str}`;
  }
  return str;
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${withLeadingZeroes(
    date.getMonth() + 1,
    2,
  )}-${withLeadingZeroes(date.getDate(), 2)}`;
}
