import { useCallback } from 'react';

const useSoundEffects = (isSoundEnabled: boolean) => {
  const playSound = useCallback((soundFile: string) => {
    if (!isSoundEnabled) return;
    
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play().catch(error => {
      console.warn('Error playing sound:', error);
    });
  }, [isSoundEnabled]);

  const playEatSound = useCallback(() => {
    playSound('eat.wav');
  }, [playSound]);

  const playCrashSound = useCallback(() => {
    playSound('crash.mp3');
  }, [playSound]);

  return {
    playEatSound,
    playCrashSound
  };
};

export default useSoundEffects;
