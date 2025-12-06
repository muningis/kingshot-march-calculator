import { describe, test, expect } from 'bun:test'
import { formatTime } from './time'

describe('formatTime', () => {
  test('should format zero seconds', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  test('should format single digit seconds', () => {
    expect(formatTime(5)).toBe('00:05')
  })

  test('should format single digit minutes', () => {
    expect(formatTime(60)).toBe('01:00')
  })

  test('should format double digit minutes and seconds', () => {
    expect(formatTime(125)).toBe('02:05')
  })

  test('should handle hours as extended minutes', () => {
    expect(formatTime(3661)).toBe('61:01')
  })

  test('should format 59 seconds correctly', () => {
    expect(formatTime(59)).toBe('00:59')
  })

  test('should format exact minute values', () => {
    expect(formatTime(180)).toBe('03:00')
  })
})
