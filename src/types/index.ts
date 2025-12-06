export interface Player {
  id: number;
  name: string;
  marchTime: number;
}

export interface Result {
  name: string;
  marchTime: number;
  startTime: number;
  arrivalTime: number;
  order: number;
}

export type MoveDirection = 'up' | 'down';
