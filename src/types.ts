export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameLogicReturn {
  snake: Position[];
  food: Position;
  score: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
  isStarted: boolean;
  moveSnake: (direction?: Direction) => void;
  resetGame: () => void;
  togglePause: () => void;
  startGame: () => void;
}

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  gameOver: boolean;
  score: number;
  isPaused: boolean;
  isStarted: boolean;
};
