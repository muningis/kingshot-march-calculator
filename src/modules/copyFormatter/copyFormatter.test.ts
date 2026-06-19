import { describe, test, expect } from 'bun:test'
import { parseTimeString, formatTimeToHHMMSS, generateCopyText } from './copyFormatter'
import type { Result } from '@/modules/calculator'

describe('parseTimeString', () => {
  test('should parse standard time format HH:MM:SS', () => {
    expect(parseTimeString('13:10:00')).toBe(47400) // 13*3600 + 10*60
    expect(parseTimeString('00:00:00')).toBe(0)
    expect(parseTimeString('23:59:59')).toBe(86399)
  })

  test('should handle single digit components', () => {
    expect(parseTimeString('1:5:3')).toBe(3903) // 1*3600 + 5*60 + 3
  })

  test('should throw error for invalid format', () => {
    expect(() => parseTimeString('25:00:00')).toThrow()
    expect(() => parseTimeString('12:60:00')).toThrow()
    expect(() => parseTimeString('12:30:60')).toThrow()
    expect(() => parseTimeString('invalid')).toThrow()
  })
})

describe('formatTimeToHHMMSS', () => {
  test('should format seconds to HH:MM:SS', () => {
    expect(formatTimeToHHMMSS(0)).toBe('00:00:00')
    expect(formatTimeToHHMMSS(3661)).toBe('01:01:01')
    expect(formatTimeToHHMMSS(47400)).toBe('13:10:00')
    expect(formatTimeToHHMMSS(86399)).toBe('23:59:59')
  })

  test('should handle times over 24 hours', () => {
    expect(formatTimeToHHMMSS(86400)).toBe('24:00:00') // 1 day
    expect(formatTimeToHHMMSS(90000)).toBe('25:00:00') // 1 day + 1 hour
  })

  test('should handle midnight crossing by wrapping to next day', () => {
    const baseTime = 86390 // 23:59:50
    const offset = 20 // +20 seconds
    const result = baseTime + offset // 86410

    // Should show as 24:00:10 (or we could wrap to 00:00:10)
    expect(formatTimeToHHMMSS(result)).toBe('24:00:10')
  })
})

describe('generateCopyText - Test Case 1: Normal case with multiple players', () => {
  test('should generate correctly formatted text with multiple players', () => {
    const baseTimeSeconds = parseTimeString('13:10:00') // 47400

    const results: Result[] = [
      { name: 'Alice', marchTime: 100, startTime: 0, arrivalTime: 100, order: 1 },
      { name: 'Bob', marchTime: 90, startTime: 11, arrivalTime: 101, order: 2 },
      { name: 'Charlie', marchTime: 80, startTime: 22, arrivalTime: 102, order: 3 }
    ]

    const expected = [
      '13:10:00 Alice',
      '13:10:11 Bob',
      '13:10:22 Charlie'
    ].join('\n')

    expect(generateCopyText(baseTimeSeconds, results)).toBe(expected)
  })

  test('should order results by start time', () => {
    const baseTimeSeconds = parseTimeString('10:00:00')

    // Results NOT in start time order
    const results: Result[] = [
      { name: 'Charlie', marchTime: 80, startTime: 22, arrivalTime: 102, order: 3 },
      { name: 'Alice', marchTime: 100, startTime: 0, arrivalTime: 100, order: 1 },
      { name: 'Bob', marchTime: 90, startTime: 11, arrivalTime: 101, order: 2 }
    ]

    const output = generateCopyText(baseTimeSeconds, results)
    const lines = output.split('\n')

    // Should be ordered by start time (Alice first, then Bob, then Charlie)
    expect(lines[0]).toContain('Alice')
    expect(lines[1]).toContain('Bob')
    expect(lines[2]).toContain('Charlie')
  })
})

describe('generateCopyText - Test Case 2: Edge case - midnight crossing', () => {
  test('should handle times that cross midnight', () => {
    const baseTimeSeconds = parseTimeString('23:59:50') // 86390

    const results: Result[] = [
      { name: 'Player1', marchTime: 20, startTime: 0, arrivalTime: 20, order: 1 },
      { name: 'Player2', marchTime: 25, startTime: 1, arrivalTime: 26, order: 2 }
    ]

    const output = generateCopyText(baseTimeSeconds, results)
    const lines = output.split('\n')

    // First player: start at 23:59:50
    expect(lines[0]).toBe('23:59:50 Player1')

    // Second player: start at 23:59:51
    expect(lines[1]).toBe('23:59:51 Player2')
  })
})

describe('generateCopyText - Test Case 3: Empty or single player', () => {
  test('should handle empty results array', () => {
    const baseTimeSeconds = parseTimeString('12:00:00')
    const results: Result[] = []

    expect(generateCopyText(baseTimeSeconds, results)).toBe('')
  })

  test('should handle single player', () => {
    const baseTimeSeconds = parseTimeString('14:30:00') // 52200

    const results: Result[] = [
      { name: 'Solo', marchTime: 50, startTime: 0, arrivalTime: 50, order: 1 }
    ]

    const expected = '14:30:00 Solo'

    expect(generateCopyText(baseTimeSeconds, results)).toBe(expected)
  })

  test('should handle player with large march time', () => {
    const baseTimeSeconds = parseTimeString('01:00:00') // 3600

    const results: Result[] = [
      { name: 'LongMarcher', marchTime: 7200, startTime: 0, arrivalTime: 7200, order: 1 }
    ]

    // Start: 01:00:00
    const expected = '01:00:00 LongMarcher'

    expect(generateCopyText(baseTimeSeconds, results)).toBe(expected)
  })
})
