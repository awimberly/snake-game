import { useCallback, useEffect, useRef } from 'react';
import { Direction } from '../types';

// Constants for swipe detection
const MIN_SWIPE_DISTANCE = 3; // Very small distance for immediate response
const MIN_SWIPE_VELOCITY = 0.1; // Lower threshold for faster detection
const DIRECTION_LOCK_MS = 100; // Prevent rapid direction changes

export const useSwipeControls = (
  onDirectionChange: (direction: Direction) => void,
  isEnabled: boolean
): void => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const lastDirection = useRef<Direction | null>(null);
  const lastDirectionTime = useRef(0);
  const isMoving = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent): void => {
    if (!isEnabled) return;
    e.preventDefault(); // Prevent scrolling
    
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    isMoving.current = true;
  }, [isEnabled]);

  const handleTouchMove = useCallback((e: TouchEvent): void => {
    if (!isEnabled || !isMoving.current) return;
    e.preventDefault(); // Prevent scrolling

    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const timeDelta = currentTime - touchStartTime.current;

    // Calculate velocity in pixels per millisecond
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / Math.max(1, timeDelta);

    // Early exit if movement is too small and slow
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && 
        Math.abs(deltaY) < MIN_SWIPE_DISTANCE && 
        velocity < MIN_SWIPE_VELOCITY) {
      return;
    }

    // Determine primary direction using absolute values
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    let direction: Direction;

    if (absX > absY) {
      direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
    } else {
      direction = deltaY > 0 ? 'DOWN' : 'UP';
    }

    // Check if enough time has passed since last direction change
    if (direction !== lastDirection.current && 
        currentTime - lastDirectionTime.current >= DIRECTION_LOCK_MS) {
      onDirectionChange(direction);
      lastDirection.current = direction;
      lastDirectionTime.current = currentTime;

      // Update reference point for next movement
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = currentTime;
    }
  }, [isEnabled, onDirectionChange]);

  const handleTouchEnd = useCallback((): void => {
    isMoving.current = false;
    lastDirection.current = null;
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const options = { passive: false };
    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, isEnabled]);
};

export default useSwipeControls;
