import { useState, useCallback } from 'react';

export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('snakeSoundEnabled');
    return saved ? saved === 'true' : true;
  });

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('snakeSoundEnabled', newValue.toString());
      return newValue;
    });
  }, []);

  const playSound = useCallback((type: 'eat' | 'crash') => {
    if (!isSoundEnabled) return;

    const soundFile = type === 'eat' ? '/snake-game/sounds/eat.wav' : '/snake-game/sounds/crash.mp3';
    const audio = new Audio(soundFile);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.warn('Error playing sound:', error);
    });
  }, [isSoundEnabled]);

  return {
    isSoundEnabled,
    toggleSound,
    playSound,
  };
};
