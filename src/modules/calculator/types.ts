/**
 * Determines how arrival times are spaced:
 * - 'sequential': each player arrives 1 second after the previous one
 * - 'simultaneous': all players arrive at the same second
 */
export type ArrivalMode = 'sequential' | 'simultaneous'

export interface CalculationInput {
  marchTime: number
  index: number
}

export interface CalculationResult {
  startTime: number
  arrivalTime: number
}

export interface Result {
  name: string
  marchTime: number
  startTime: number
  arrivalTime: number
  order: number
}
