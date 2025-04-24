export const GRID_SIZE = 20;
export const CELL_SIZE = 25;
export const INITIAL_SPEED = 150; // milliseconds between moves
export const SPEED_INCREMENT = 0.95; // speed multiplier when food is eaten

// Colors
export type Theme = 'light' | 'dark';

export const THEME_COLORS = {
  light: {
    BACKGROUND: '#f5f5f5',
    GRID: '#e5e5e5',
    SNAKE_HEAD: '#4ade80',
    SNAKE_BODY: '#22c55e',
    SNAKE_BORDER: '#15803d',
    FOOD: '#dc2626',
    FOOD_BORDER: '#991b1b',
    TEXT: '#1a1a1a',
    BUTTON: {
      BACKGROUND: '#3b82f6',
      HOVER: '#2563eb',
      TEXT: '#ffffff'
    }
  },
  dark: {
  BACKGROUND: '#1a1a1a',
  GRID: '#2a2a2a',
  SNAKE_HEAD: '#4ade80',
  SNAKE_BODY: '#22c55e',
  SNAKE_BORDER: '#15803d',
  FOOD: '#dc2626',
  FOOD_BORDER: '#991b1b',
  TEXT: '#ffffff',
  BUTTON: {
    BACKGROUND: '#3b82f6',
    HOVER: '#2563eb',
    TEXT: '#ffffff'
  }
  }
} as const;

export const getColors = (theme: Theme) => THEME_COLORS[theme];
