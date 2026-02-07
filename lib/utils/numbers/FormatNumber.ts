export default function FormatNumber(digit: number): string {
  return new Intl.NumberFormat("en-US").format(digit);
}
