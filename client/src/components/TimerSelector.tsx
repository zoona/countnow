import { Card } from '@/components/ui/card';
import { Clock, Infinity } from 'lucide-react';

interface TimerOption {
  value: number;
  label: string;
}

interface TimerSelectorProps {
  selectedTimer: number;
  onTimerChange: (seconds: number) => void;
}

const TIMER_OPTIONS: TimerOption[] = [
  { value: 0, label: '제한 없음' },
  { value: 60, label: '1분' },
  { value: 180, label: '3분' },
  { value: 300, label: '5분' },
  { value: 600, label: '10분' },
];

export default function TimerSelector({ selectedTimer, onTimerChange }: TimerSelectorProps) {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">타이머 설정</h2>
        <p className="text-sm text-muted-foreground">게임 시간을 선택하세요</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TIMER_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer text-center transition-all hover-elevate ${
              selectedTimer === option.value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onTimerChange(option.value)}
            data-testid={`card-timer-${option.value}`}
          >
            <div className={`flex flex-col items-center gap-2 ${
              selectedTimer === option.value ? 'text-primary' : ''
            }`}>
              {option.value === 0 ? (
                <Infinity className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6" />
              )}
              <span className="font-medium text-sm" data-testid={`text-timer-label-${option.value}`}>
                {option.label}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
