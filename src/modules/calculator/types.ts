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
