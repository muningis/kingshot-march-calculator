/**
 * Formats seconds to MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (e.g., "02:05")
 * @example formatTime(125) // "02:05"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
