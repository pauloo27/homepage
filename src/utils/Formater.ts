export function withLeadingZeroes(number: number, size: number): string {
  let str = number.toString();

  while (str.length < size) {
    str = "0" + str;
  }
  return str;
}
