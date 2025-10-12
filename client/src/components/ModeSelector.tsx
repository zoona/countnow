import { Card } from '@/components/ui/card';
import { Zap, Ban, Smile } from 'lucide-react';

interface Mode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ModeSelectorProps {
  selectedMode: string;
  onModeChange: (modeId: string) => void;
}

const MODES: Mode[] = [
  {
    id: 'free',
    name: '자유 카운트',
    description: '자유롭게 카운트를 기록하세요',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 'english-ban',
    name: '영어 금지',
    description: '영어 단어를 말하면 +1',
    icon: <Ban className="h-6 w-6" />,
  },
  {
    id: 'no-laugh',
    name: '웃으면 +1',
    description: '웃으면 카운트가 올라갑니다',
    icon: <Smile className="h-6 w-6" />,
  },
];

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">게임 모드</h2>
        <p className="text-sm text-muted-foreground">게임 모드를 선택하세요</p>
      </div>

      <div className="grid gap-3">
        {MODES.map((mode) => (
          <Card
            key={mode.id}
            className={`p-4 cursor-pointer transition-all hover-elevate ${
              selectedMode === mode.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onModeChange(mode.id)}
            data-testid={`card-mode-${mode.id}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${
                selectedMode === mode.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {mode.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg" data-testid={`text-mode-name-${mode.id}`}>
                  {mode.name}
                </h3>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
