import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Sparkles } from 'lucide-react';
import { useAISpeed, type AISpeedStep } from '@/hooks/useAISpeed';

export function AISpeedControl() {
  const { speedStep, setSpeedStep } = useAISpeed();

  const speeds: Array<{ value: AISpeedStep; label: string; icon: React.ReactNode; description: string }> = [
    { value: 'fast', label: 'Fast', icon: <Zap className="w-4 h-4" />, description: 'Near-instant AI moves' },
    { value: 'normal', label: 'Normal', icon: <Clock className="w-4 h-4" />, description: 'Balanced gameplay' },
    { value: 'smooth', label: 'Smooth', icon: <Sparkles className="w-4 h-4" />, description: 'Animated AI thinking' },
  ];

  return (
    <Card className="border-neon-blue/30 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neon-blue text-sm">AI Speed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {speeds.map((speed) => (
          <Button
            key={speed.value}
            onClick={() => setSpeedStep(speed.value)}
            variant={speedStep === speed.value ? 'default' : 'outline'}
            className={`w-full justify-start gap-2 ${
              speedStep === speed.value
                ? 'bg-neon-blue/20 border-neon-blue text-neon-blue hover:bg-neon-blue/30'
                : 'border-border/30 hover:border-neon-blue/50 hover:bg-neon-blue/10'
            }`}
          >
            {speed.icon}
            <div className="flex flex-col items-start flex-1">
              <span className="font-semibold">{speed.label}</span>
              <span className="text-xs text-muted-foreground">{speed.description}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
