import { useState, useEffect } from 'react';

export type AISpeedStep = 'fast' | 'normal' | 'smooth';

interface AISpeedConfig {
  aiDelay: number;
  thinkingThreshold: number;
}

const SPEED_CONFIGS: Record<AISpeedStep, AISpeedConfig> = {
  fast: {
    aiDelay: 50, // Near-instant
    thinkingThreshold: 100, // Only show "thinking" if computation takes >100ms
  },
  normal: {
    aiDelay: 300,
    thinkingThreshold: 50,
  },
  smooth: {
    aiDelay: 600,
    thinkingThreshold: 50,
  },
};

const STORAGE_KEY = 'neon-tictactoe-ai-speed';

export function useAISpeed() {
  const [speedStep, setSpeedStep] = useState<AISpeedStep>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'fast' || stored === 'normal' || stored === 'smooth')) {
        return stored as AISpeedStep;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 'fast'; // Default to fast as requested
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, speedStep);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [speedStep]);

  const config = SPEED_CONFIGS[speedStep];

  return {
    speedStep,
    setSpeedStep,
    aiDelay: config.aiDelay,
    thinkingThreshold: config.thinkingThreshold,
  };
}
