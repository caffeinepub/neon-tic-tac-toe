import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'move' | 'win' | 'lose' | 'draw';

const SOUND_PATHS: Record<SoundType, string> = {
  move: '/assets/sfx/move-click.mp3',
  win: '/assets/sfx/win.mp3',
  lose: '/assets/sfx/lose.mp3',
  draw: '/assets/sfx/draw.mp3',
};

export function useSound(enabled: boolean = true) {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    move: null,
    win: null,
    lose: null,
    draw: null,
  });

  // Preload all sounds
  useEffect(() => {
    Object.entries(SOUND_PATHS).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.5;
      audioRefs.current[type as SoundType] = audio;
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      const audio = audioRefs.current[type];
      if (audio) {
        // Reset to start if already playing
        audio.currentTime = 0;
        // Play with error handling for autoplay restrictions
        audio.play().catch((error) => {
          console.warn('Sound playback failed:', error);
        });
      }
    },
    [enabled]
  );

  return { playSound };
}
