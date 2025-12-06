import type { CalculationInput, CalculationResult } from './types'

/**
 * Calculates the minimum arrival time for the first player
 * Formula: max(marchTime[i] - i) for all players
 * This ensures all start times are non-negative
 */
export function calculateMinArrivalTime(
  inputs: CalculationInput[]
): number {
  if (inputs.length === 0) return 0

  return Math.max(...inputs.map(input => input.marchTime - input.index))
}

/**
 * Calculates start and arrival times for all players
 * Each player arrives exactly 1 second after the previous one
 * All start times must be non-negative (at or after 00:00)
 */
export function calculateStartTimes(
  inputs: CalculationInput[]
): CalculationResult[] {
  if (inputs.length === 0) return []

  const minArrivalTime = calculateMinArrivalTime(inputs)

  return inputs.map(input => {
    const arrivalTime = minArrivalTime + input.index
    const startTime = arrivalTime - input.marchTime

    return {
      startTime,
      arrivalTime
    }
  })
}
