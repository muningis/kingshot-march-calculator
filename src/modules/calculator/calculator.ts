import type { ArrivalMode, CalculationInput, CalculationResult } from './types'

/**
 * Calculates the minimum arrival time for the first player
 * This ensures all start times are non-negative (at or after 00:00)
 * - 'sequential': max(marchTime[i] - i) for all players
 * - 'simultaneous': max(marchTime[i]) for all players
 */
export function calculateMinArrivalTime(
  inputs: CalculationInput[],
  mode: ArrivalMode = 'sequential'
): number {
  if (inputs.length === 0) return 0

  if (mode === 'simultaneous') {
    return Math.max(...inputs.map(input => input.marchTime))
  }

  return Math.max(...inputs.map(input => input.marchTime - input.index))
}

/**
 * Calculates start and arrival times for all players
 * - 'sequential': each player arrives exactly 1 second after the previous one
 * - 'simultaneous': all players arrive at the same second
 * All start times must be non-negative (at or after 00:00)
 */
export function calculateStartTimes(
  inputs: CalculationInput[],
  mode: ArrivalMode = 'sequential'
): CalculationResult[] {
  if (inputs.length === 0) return []

  const minArrivalTime = calculateMinArrivalTime(inputs, mode)

  return inputs.map(input => {
    const arrivalTime =
      mode === 'simultaneous' ? minArrivalTime : minArrivalTime + input.index
    const startTime = arrivalTime - input.marchTime

    return {
      startTime,
      arrivalTime
    }
  })
}
