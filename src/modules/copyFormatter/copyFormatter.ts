import type { Result } from '@/modules/calculator'

/**
 * Parses a time string in HH:MM:SS format to seconds since midnight
 * @param time - Time string in format HH:MM:SS (e.g., "13:10:00")
 * @returns Total seconds since midnight
 * @throws Error if time format is invalid
 */
export function parseTimeString(time: string): number {
  const parts = time.split(':')

  if (parts.length !== 3) {
    throw new Error(`Invalid time format: ${time}. Expected HH:MM:SS`)
  }

  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  const seconds = parseInt(parts[2], 10)

  // Validate ranges
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error(`Invalid time format: ${time}. Contains non-numeric values`)
  }

  if (hours < 0 || hours > 23) {
    throw new Error(`Invalid hours: ${hours}. Must be between 0 and 23`)
  }

  if (minutes < 0 || minutes > 59) {
    throw new Error(`Invalid minutes: ${minutes}. Must be between 0 and 59`)
  }

  if (seconds < 0 || seconds > 59) {
    throw new Error(`Invalid seconds: ${seconds}. Must be between 0 and 59`)
  }

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Formats seconds to HH:MM:SS format
 * Handles times over 24 hours (e.g., 25:00:00 for day overflow)
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "13:10:00")
 */
export function formatTimeToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Generates formatted copy text from results with base time offset
 * Format: "{startTime} {arriveTime} {playerName}" per line
 * Sorted by start time (earliest first)
 * @param baseTimeSeconds - Base time offset in seconds since midnight
 * @param results - Array of calculation results
 * @returns Formatted text ready for clipboard
 */
export function generateCopyText(
  baseTimeSeconds: number,
  results: Result[]
): string {
  if (results.length === 0) {
    return ''
  }

  // Sort results by start time (ascending)
  const sortedResults = [...results].sort((a, b) => a.startTime - b.startTime)

  // Format each result
  const lines = sortedResults.map(result => {
    const absoluteStartTime = baseTimeSeconds + result.startTime
    const absoluteArrivalTime = baseTimeSeconds + result.arrivalTime

    const startTimeFormatted = formatTimeToHHMMSS(absoluteStartTime)
    const arrivalTimeFormatted = formatTimeToHHMMSS(absoluteArrivalTime)

    return `${startTimeFormatted} ${arrivalTimeFormatted} ${result.name}`
  })

  return lines.join('\n')
}
