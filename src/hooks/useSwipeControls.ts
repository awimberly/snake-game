import { useEffect } from 'react';
import { Direction } from '../types';

export const useSwipeControls = (
  onDirectionChange: (direction: Direction) => void,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled) return;

    let touchStartX = 0;
    let touchStartY = 0;
    const MIN_SWIPE_DISTANCE = 30;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only handle the swipe if it's long enough
      if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) return;

      // Determine if the swipe is more horizontal or vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          onDirectionChange('RIGHT');
        } else {
          onDirectionChange('LEFT');
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onDirectionChange('DOWN');
        } else {
          onDirectionChange('UP');
        }
      }

      // Reset touch start coordinates
      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onDirectionChange, isEnabled]);
};
