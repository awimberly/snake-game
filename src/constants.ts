export const GRID_SIZE = 15;
export const CELL_SIZE = 25;
export const INITIAL_SPEED = 150; // milliseconds between moves
export const SPEED_INCREMENT = 0.95; // speed multiplier when food is eaten

// Colors
export type Theme = 'light' | 'dark';

export const THEME_COLORS = {
  light: {
    BACKGROUND: "#f5f5f5",
    GRID: "#e5e5e5",
    SNAKE_HEAD: "#4ade80",
    SNAKE_BODY: "#22c55e",
    SNAKE_BORDER: "#15803d",
    FOOD: "#dc2626",
    FOOD_BORDER: "#991b1b",
    TEXT: "#1a1a1a",
    BUTTON: {
      BACKGROUND: "#e5e5e5",
      TEXT: "#1a1a1a",
      HOVER: "#d4d4d4"
    },
    buttonBackground: "#e5e5e5",
    buttonText: "#1a1a1a",
    buttonHover: "#d4d4d4"
  },
  dark: {
    BACKGROUND: "#1a1a1a",
    GRID: "#262626",
    SNAKE_HEAD: "#4ade80",
    SNAKE_BODY: "#22c55e",
    SNAKE_BORDER: "#15803d",
    FOOD: "#dc2626",
    FOOD_BORDER: "#991b1b",
    TEXT: "#f5f5f5",
    BUTTON: {
      BACKGROUND: "#262626",
      TEXT: "#f5f5f5",
      HOVER: "#404040"
    },
    buttonBackground: "#262626",
    buttonText: "#f5f5f5",
    buttonHover: "#404040"
  }
} as const;

export const getColors = (theme: Theme) => THEME_COLORS[theme];
