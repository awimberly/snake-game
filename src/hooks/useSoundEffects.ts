import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'eat' | 'crash';

const useSoundEffects = (isSoundEnabled: boolean) => {
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffers = useRef<{ [key in SoundType]?: AudioBuffer }>({});
  const isUnlocked = useRef(false);

  // Initialize audio context and load sounds
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Create audio context
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Load sound files
        const loadSound = async (type: SoundType) => {
          const fileName = type === 'eat' ? 'eat.wav' : 'crash.mp3';
          const response = await fetch(`${process.env.PUBLIC_URL}/sounds/${fileName}`);
          const arrayBuffer = await response.arrayBuffer();
          audioBuffers.current[type] = await audioContext.current!.decodeAudioData(arrayBuffer);
        };

        // Load both sounds in parallel
        await Promise.all([
          loadSound('eat'),
          loadSound('crash')
        ]);
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initAudio();

    // Cleanup
    return () => {
      if (audioContext.current?.state !== 'closed') {
        audioContext.current?.close();
      }
    };
  }, []);

  // Unlock audio on mobile devices
  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioContext.current || isUnlocked.current) return;

      // Create and play a silent buffer
      const buffer = audioContext.current.createBuffer(1, 1, 22050);
      const source = audioContext.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current.destination);
      source.start(0);

      // Resume audio context
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }

      isUnlocked.current = true;
    };

    const handleInteraction = () => {
      unlockAudio();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('touchend', handleInteraction);
    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!isSoundEnabled || !audioContext.current || audioContext.current.state !== 'running') return;

    const buffer = audioBuffers.current[type];
    if (!buffer) return;

    try {
      const source = audioContext.current.createBufferSource();
      const gainNode = audioContext.current.createGain();
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      // Set volume (0.3 = 30%)
      gainNode.gain.value = 0.3;

      // Set buffer and play
      source.buffer = buffer;
      source.start(0);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isSoundEnabled]);

  const playEatSound = useCallback(() => {
    playSound('eat');
  }, [playSound]);

  const playCrashSound = useCallback(() => {
    playSound('crash');
  }, [playSound]);

  return {
    playEatSound,
    playCrashSound
  };
};

export default useSoundEffects;
