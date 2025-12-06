import { describe, test, expect } from 'bun:test'
import { calculateMinArrivalTime, calculateStartTimes } from './calculator'
import type { CalculationInput } from './types'

describe('calculateMinArrivalTime', () => {
  test('should return 0 for empty input', () => {
    expect(calculateMinArrivalTime([])).toBe(0)
  })

  test('should calculate for single player', () => {
    const inputs: CalculationInput[] = [{ marchTime: 100, index: 0 }]
    expect(calculateMinArrivalTime(inputs)).toBe(100)
  })

  test('should calculate for multiple players', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 100, index: 0 },
      { marchTime: 90, index: 1 },
      { marchTime: 80, index: 2 }
    ]
    expect(calculateMinArrivalTime(inputs)).toBe(100)
  })

  test('should handle case where later player has longer march time', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 50, index: 0 },
      { marchTime: 100, index: 1 }
    ]
    // max(50-0, 100-1) = max(50, 99) = 99
    expect(calculateMinArrivalTime(inputs)).toBe(99)
  })
})

describe('calculateStartTimes', () => {
  test('should return empty array for empty input', () => {
    expect(calculateStartTimes([])).toEqual([])
  })

  test('should calculate for single player', () => {
    const inputs: CalculationInput[] = [{ marchTime: 100, index: 0 }]
    const results = calculateStartTimes(inputs)

    expect(results).toHaveLength(1)
    expect(results[0].startTime).toBe(0)
    expect(results[0].arrivalTime).toBe(100)
  })

  test('should calculate for multiple players with same march time', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 100, index: 0 },
      { marchTime: 100, index: 1 },
      { marchTime: 100, index: 2 }
    ]
    const results = calculateStartTimes(inputs)

    expect(results[0].startTime).toBe(0)
    expect(results[0].arrivalTime).toBe(100)
    expect(results[1].startTime).toBe(1)
    expect(results[1].arrivalTime).toBe(101)
    expect(results[2].startTime).toBe(2)
    expect(results[2].arrivalTime).toBe(102)
  })

  test('should calculate for multiple players with different march times', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 100, index: 0 },
      { marchTime: 90, index: 1 },
      { marchTime: 80, index: 2 }
    ]
    const results = calculateStartTimes(inputs)

    expect(results[0].startTime).toBe(0)
    expect(results[0].arrivalTime).toBe(100)
    expect(results[1].startTime).toBe(11)
    expect(results[1].arrivalTime).toBe(101)
    expect(results[2].startTime).toBe(22)
    expect(results[2].arrivalTime).toBe(102)
  })

  test('should ensure 1-second interval between arrivals', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 100, index: 0 },
      { marchTime: 90, index: 1 },
      { marchTime: 80, index: 2 }
    ]
    const results = calculateStartTimes(inputs)

    expect(results[1].arrivalTime - results[0].arrivalTime).toBe(1)
    expect(results[2].arrivalTime - results[1].arrivalTime).toBe(1)
  })

  test('should ensure all start times are non-negative', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 50, index: 0 },
      { marchTime: 100, index: 1 },
      { marchTime: 75, index: 2 }
    ]
    const results = calculateStartTimes(inputs)

    results.forEach(result => {
      expect(result.startTime).toBeGreaterThanOrEqual(0)
    })
  })

  test('should handle case where march time equals index', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 0, index: 0 },
      { marchTime: 1, index: 1 },
      { marchTime: 2, index: 2 }
    ]
    const results = calculateStartTimes(inputs)

    // minArrivalTime = max(0-0, 1-1, 2-2) = 0
    expect(results[0].startTime).toBe(0)
    expect(results[0].arrivalTime).toBe(0)
    expect(results[1].startTime).toBe(0)
    expect(results[1].arrivalTime).toBe(1)
    expect(results[2].startTime).toBe(0)
    expect(results[2].arrivalTime).toBe(2)
  })

  test('should handle large march time differences', () => {
    const inputs: CalculationInput[] = [
      { marchTime: 1000, index: 0 },
      { marchTime: 10, index: 1 }
    ]
    const results = calculateStartTimes(inputs)

    expect(results[0].startTime).toBe(0)
    expect(results[0].arrivalTime).toBe(1000)
    expect(results[1].startTime).toBe(991)
    expect(results[1].arrivalTime).toBe(1001)
    expect(results[1].arrivalTime - results[0].arrivalTime).toBe(1)
  })
})
