import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

interface PenaltyWheelProps {
  onClose: () => void;
}

const PENALTIES = [
  '물 한 컵 가져오기 💧',
  '춤 10초 추기 💃',
  '애교 한번 부리기 😘',
  '노래 한 소절 부르기 🎤',
  '팔굽혀펴기 5개 💪',
  '윙크 3번 하기 😉',
  '배꼽 인사하기 🙇',
  '개인기 보여주기 🎭',
  '간단한 요리하기 🍳',
  '청소 담당 🧹',
];

export default function PenaltyWheel({ onClose }: PenaltyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState('');
  const [displayText, setDisplayText] = useState('');

  const spin = () => {
    setIsSpinning(true);
    setDisplayText('');
    
    let counter = 0;
    const spinInterval = setInterval(() => {
      setDisplayText(PENALTIES[counter % PENALTIES.length]);
      counter++;
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalPenalty = PENALTIES[Math.floor(Math.random() * PENALTIES.length)];
      setDisplayText(finalPenalty);
      setSelectedPenalty(finalPenalty);
      setIsSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    spin();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">벌칙 룰렛</h2>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-penalty">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="py-12 text-center">
          <div className={`text-4xl font-bold transition-all ${isSpinning ? 'blur-sm scale-110' : 'scale-100'}`}>
            {displayText || '🎲'}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={spin}
            disabled={isSpinning}
            className="flex-1"
            size="lg"
            data-testid="button-spin-penalty"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            다시 뽑기
          </Button>
        </div>

        {selectedPenalty && !isSpinning && (
          <p className="text-center text-sm text-muted-foreground">
            이 벌칙을 수행하세요!
          </p>
        )}
      </Card>
    </div>
  );
}
