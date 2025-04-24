import { useEffect } from 'react';
import { Direction } from '../types';

export const useKeyboardControls = (
  onDirectionChange: (direction: Direction) => void,
  onPauseToggle: () => void,
  isGameOver: boolean
) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onDirectionChange('RIGHT');
          break;
        case ' ':
        case 'p':
        case 'P':
          onPauseToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDirectionChange, onPauseToggle, isGameOver]);
};
