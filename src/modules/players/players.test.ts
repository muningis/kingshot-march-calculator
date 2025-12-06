import { describe, test, expect } from 'bun:test'
import { addPlayer, removePlayer, movePlayer, updatePlayerMarchTime, updatePlayerName } from './players'
import type { Player } from './types'

describe('addPlayer', () => {
  test('should add player with valid data', () => {
    const players: Player[] = []
    const result = addPlayer(players, 'Alice', 100)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
    expect(result[0].marchTime).toBe(100)
    expect(result[0].id).toBeGreaterThan(0)
  })

  test('should trim whitespace from name', () => {
    const players: Player[] = []
    const result = addPlayer(players, '  Bob  ', 90)

    expect(result[0].name).toBe('Bob')
  })

  test('should preserve existing players', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = addPlayer(players, 'Bob', 90)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Alice')
    expect(result[1].name).toBe('Bob')
  })
})

describe('removePlayer', () => {
  test('should remove existing player', () => {
    const players: Player[] = [
      { id: 1, name: 'Alice', marchTime: 100 },
      { id: 2, name: 'Bob', marchTime: 90 }
    ]
    const result = removePlayer(players, 1)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bob')
  })

  test('should return unchanged array when player not found', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = removePlayer(players, 999)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
  })

  test('should handle empty array', () => {
    const players: Player[] = []
    const result = removePlayer(players, 1)

    expect(result).toHaveLength(0)
  })
})

describe('movePlayer', () => {
  const players: Player[] = [
    { id: 1, name: 'Alice', marchTime: 100 },
    { id: 2, name: 'Bob', marchTime: 90 },
    { id: 3, name: 'Charlie', marchTime: 80 }
  ]

  test('should move player up from middle position', () => {
    const result = movePlayer(players, 1, 'up')

    expect(result[0].name).toBe('Bob')
    expect(result[1].name).toBe('Alice')
    expect(result[2].name).toBe('Charlie')
  })

  test('should not move first player up', () => {
    const result = movePlayer(players, 0, 'up')

    expect(result).toEqual(players)
  })

  test('should move player down from middle position', () => {
    const result = movePlayer(players, 1, 'down')

    expect(result[0].name).toBe('Alice')
    expect(result[1].name).toBe('Charlie')
    expect(result[2].name).toBe('Bob')
  })

  test('should not move last player down', () => {
    const result = movePlayer(players, 2, 'down')

    expect(result).toEqual(players)
  })

  test('should move first player down', () => {
    const result = movePlayer(players, 0, 'down')

    expect(result[0].name).toBe('Bob')
    expect(result[1].name).toBe('Alice')
  })

  test('should move last player up', () => {
    const result = movePlayer(players, 2, 'up')

    expect(result[1].name).toBe('Charlie')
    expect(result[2].name).toBe('Bob')
  })
})

describe('updatePlayerMarchTime', () => {
  test('should update march time for existing player', () => {
    const players: Player[] = [
      { id: 1, name: 'Alice', marchTime: 100 },
      { id: 2, name: 'Bob', marchTime: 90 }
    ]
    const result = updatePlayerMarchTime(players, 1, 150)

    expect(result[0].marchTime).toBe(150)
    expect(result[1].marchTime).toBe(90)
  })

  test('should not change array when player not found', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = updatePlayerMarchTime(players, 999, 150)

    expect(result).toEqual(players)
  })

  test('should preserve other player properties', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = updatePlayerMarchTime(players, 1, 150)

    expect(result[0].id).toBe(1)
    expect(result[0].name).toBe('Alice')
    expect(result[0].marchTime).toBe(150)
  })
})

describe('updatePlayerName', () => {
  test('should update player name', () => {
    const players: Player[] = [
      { id: 1, name: 'Alice', marchTime: 100 },
      { id: 2, name: 'Bob', marchTime: 90 }
    ]
    const result = updatePlayerName(players, 1, 'Alicia')

    expect(result[0].name).toBe('Alicia')
    expect(result[1].name).toBe('Bob')
  })

  test('should trim whitespace from name', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = updatePlayerName(players, 1, '  Alicia  ')

    expect(result[0].name).toBe('Alicia')
  })

  test('should not change array when player not found', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = updatePlayerName(players, 999, 'Unknown')

    expect(result).toEqual(players)
  })

  test('should preserve other player properties', () => {
    const players: Player[] = [{ id: 1, name: 'Alice', marchTime: 100 }]
    const result = updatePlayerName(players, 1, 'Alicia')

    expect(result[0].id).toBe(1)
    expect(result[0].marchTime).toBe(100)
  })
})
