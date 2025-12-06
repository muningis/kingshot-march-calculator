import type { Player, MoveDirection } from './types'

/**
 * Generates a unique player ID using timestamp
 */
export function generatePlayerId(): number {
  return Date.now()
}

/**
 * Adds a new player to the list
 */
export function addPlayer(
  players: Player[],
  name: string,
  marchTime: number
): Player[] {
  return [
    ...players,
    {
      id: generatePlayerId(),
      name: name.trim(),
      marchTime
    }
  ]
}

/**
 * Removes a player by ID
 */
export function removePlayer(
  players: Player[],
  id: number
): Player[] {
  return players.filter(p => p.id !== id)
}

/**
 * Moves a player up or down in the list
 */
export function movePlayer(
  players: Player[],
  index: number,
  direction: MoveDirection
): Player[] {
  const newIndex = direction === 'up' ? index - 1 : index + 1

  // Check bounds
  if (newIndex < 0 || newIndex >= players.length) {
    return players
  }

  const newPlayers = [...players]
  ;[newPlayers[index], newPlayers[newIndex]] = [newPlayers[newIndex], newPlayers[index]]
  return newPlayers
}

/**
 * Updates a player's march time
 */
export function updatePlayerMarchTime(
  players: Player[],
  id: number,
  marchTime: number
): Player[] {
  return players.map(p =>
    p.id === id ? { ...p, marchTime } : p
  )
}

/**
 * Updates a player's name
 */
export function updatePlayerName(
  players: Player[],
  id: number,
  name: string
): Player[] {
  return players.map(p =>
    p.id === id ? { ...p, name: name.trim() } : p
  )
}
