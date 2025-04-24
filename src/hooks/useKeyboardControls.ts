import { useEffect } from 'react';
import { Direction } from '../types';

export const useKeyboardControls = (
  moveSnake: (direction?: Direction) => void,
  togglePause: () => void,
  isGameOver: boolean,
  isStarted: boolean,
  startGame: () => void
) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D', ' ', 'p', 'P'].includes(e.key)) {
        e.preventDefault();
      }

      // Handle pause/start
      if ([' ', 'p', 'P'].includes(e.key)) {
        if (!isStarted && !isGameOver) {
          startGame();
        } else {
          togglePause();
        }
        return;
      }

      // Only process movement if game is active
      if (isGameOver || !isStarted) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveSnake('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveSnake('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveSnake('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveSnake('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveSnake, togglePause, isGameOver, isStarted, startGame]);
};
