/** 毫秒转为保留一位小数的秒数字符串，例如 12345 → "12.3"。 */
export function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1);
}
