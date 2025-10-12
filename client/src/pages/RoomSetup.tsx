import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import PlayerSetup from '@/components/PlayerSetup';
import ModeSelector from '@/components/ModeSelector';
import TimerSelector from '@/components/TimerSelector';

interface Player {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export default function RoomSetup() {
  const [, setLocation] = useLocation();
  const { code } = useParams();
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedMode, setSelectedMode] = useState('free');
  const [selectedTimer, setSelectedTimer] = useState(180);

  const handleNext = () => {
    if (step === 1 && players.length === 0) {
      alert('최소 1명의 참가자를 추가해주세요');
      return;
    }
    
    if (step === 3) {
      setLocation(`/room/${code}/game`);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setLocation('/');
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              뒤로
            </Button>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    s === step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              data-testid="button-next"
            >
              {step === 3 ? '게임 시작' : '다음'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        <div className="pb-20">
          {step === 1 && (
            <PlayerSetup players={players} onPlayersChange={setPlayers} />
          )}
          {step === 2 && (
            <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
          )}
          {step === 3 && (
            <TimerSelector selectedTimer={selectedTimer} onTimerChange={setSelectedTimer} />
          )}
        </div>
      </div>
    </div>
  );
}
