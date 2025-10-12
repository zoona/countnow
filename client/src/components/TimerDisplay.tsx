import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface TimerDisplayProps {
  totalSeconds: number;
  onComplete?: () => void;
}

export default function TimerDisplay({ totalSeconds, onComplete }: TimerDisplayProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds, onComplete]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 0;

  const handleReset = () => {
    setRemainingSeconds(totalSeconds);
    setIsPaused(false);
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className={`flex-1 text-center ${isWarning ? 'animate-pulse' : ''}`}>
          <div 
            className={`text-4xl font-bold font-mono ${isWarning ? 'text-destructive' : 'text-foreground'}`}
            data-testid="text-timer"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsPaused(!isPaused)}
            data-testid="button-timer-pause"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handleReset}
            data-testid="button-timer-reset"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
