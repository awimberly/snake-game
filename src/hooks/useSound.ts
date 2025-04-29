import { useState, useCallback, useEffect, useRef } from 'react';

type SoundType = 'eat' | 'crash';

interface SoundConfig {
  wav?: string;
  mp3?: string;
  ogg?: string;
}

const SOUNDS: { [key in SoundType]: SoundConfig } = {
  eat: {
    wav: '/sounds/eat.wav',
    ogg: '/sounds/eat.ogg'
  },
  crash: {
    mp3: '/sounds/crash.mp3',
    ogg: '/sounds/crash.ogg'
  }
};

export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('snakeSoundEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const soundElements = useRef<{ [key in SoundType]?: HTMLAudioElement }>({});
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  // Initialize sound elements
  useEffect(() => {
    const createAudio = (type: SoundType) => {
      const config = SOUNDS[type];
      const audio = new Audio();
      
      // Try different formats in order of preference
      const sources = [
        { type: 'audio/ogg', src: config.ogg },
        { type: 'audio/wav', src: config.wav },
        { type: 'audio/mpeg', src: config.mp3 }
      ].filter(source => source.src);

      // Add source elements
      sources.forEach(source => {
        const sourceElement = document.createElement('source');
        sourceElement.type = source.type;
        sourceElement.src = `${process.env.PUBLIC_URL}${source.src}`;
        audio.appendChild(sourceElement);
      });

      audio.preload = 'auto';
      audio.volume = 0.5; // 50% volume
      audio.load(); // Start loading the audio
      return audio;
    };

    // Create audio elements for each sound
    Object.keys(SOUNDS).forEach(type => {
      soundElements.current[type as SoundType] = createAudio(type as SoundType);
    });

    // Unlock audio on first interaction
    const unlockAudio = () => {
      if (isAudioUnlocked) return;
      
      // Play all sounds silently to unlock them
      Object.values(soundElements.current).forEach(audio => {
        if (audio) {
          audio.volume = 0;
          audio.play().catch(() => {}).finally(() => {
            audio.volume = 0.5;
            audio.currentTime = 0;
          });
        }
      });
      
      setIsAudioUnlocked(true);
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);

      Object.values(soundElements.current).forEach(audio => {
        if (audio) {
          audio.pause();
          while (audio.firstChild) {
            audio.removeChild(audio.firstChild);
          }
          audio.src = '';
          audio.load();
        }
      });
      soundElements.current = {};
    };
  }, [isAudioUnlocked]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('snakeSoundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev: boolean) => !prev);
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!isSoundEnabled || !isAudioUnlocked) return;

    const audio = soundElements.current[type];
    if (!audio) return;

    try {
      // Reset and play
      audio.currentTime = 0;
      const playPromise = audio.play();

      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Error playing sound:', error);
          // If autoplay was prevented, try again on next interaction
          const retryPlay = () => {
            audio.play().catch(console.error);
            document.removeEventListener('touchstart', retryPlay);
            document.removeEventListener('click', retryPlay);
          };

          document.addEventListener('touchstart', retryPlay, { once: true });
          document.addEventListener('click', retryPlay, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isSoundEnabled, isAudioUnlocked]);

  return {
    isSoundEnabled,
    toggleSound,
    playSound
  };
};

export default useSound;
