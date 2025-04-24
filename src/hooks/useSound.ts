import { useState, useCallback, useEffect } from 'react';

interface Sound {
  eat: HTMLAudioElement;
  crash: HTMLAudioElement;
}

export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const savedSoundPreference = localStorage.getItem('soundEnabled');
    return savedSoundPreference ? JSON.parse(savedSoundPreference) : true;
  });
  const [sounds, setSounds] = useState<Sound | null>(null);

  useEffect(() => {
    // Initialize sounds
    const eatSound = new Audio('/sounds/eat.mp3');
    const crashSound = new Audio('/sounds/crash.mp3');

    setSounds({
      eat: eatSound,
      crash: crashSound,
    });

    // Save sound preference to localStorage
    localStorage.setItem('soundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  const playSound = useCallback((soundType: keyof Sound) => {
    if (isSoundEnabled && sounds) {
      sounds[soundType].currentTime = 0; // Reset sound to start
      sounds[soundType].play().catch(error => {
        console.warn('Error playing sound:', error);
      });
    }
  }, [isSoundEnabled, sounds]);

  return {
    isSoundEnabled,
    toggleSound,
    playSound,
  };
};
