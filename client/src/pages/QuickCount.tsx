import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Share2 } from 'lucide-react';
import { useParams } from 'wouter';
import PlayerButton from '@/components/PlayerButton';
import ShareDialog from '@/components/ShareDialog';

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

interface PresetLabel {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const PRESET_LABELS: PresetLabel[] = [
  // 가족
  { id: 'mom', name: '엄마', emoji: '👩', color: '#FF8A80' },
  { id: 'dad', name: '아빠', emoji: '👨', color: '#80D8FF' },
  { id: 'sister', name: '누나', emoji: '👧', color: '#CE93D8' },
  { id: 'brother', name: '형', emoji: '👦', color: '#A7FFEB' },
  { id: 'younger-sister', name: '여동생', emoji: '👧', color: '#FFB3E6' },
  { id: 'younger-brother', name: '남동생', emoji: '👦', color: '#B3E0FF' },
  
  // 재미있는 이모지
  { id: 'student1', name: '1번', emoji: '1️⃣', color: '#FFE082' },
  { id: 'student2', name: '2번', emoji: '2️⃣', color: '#BCAAA4' },
  { id: 'student3', name: '3번', emoji: '3️⃣', color: '#CE93D8' },
  { id: 'student4', name: '4번', emoji: '4️⃣', color: '#A5D6A7' },
  { id: 'cat', name: '고양이', emoji: '🐱', color: '#FFAB91' },
  { id: 'dog', name: '강아지', emoji: '🐶', color: '#80DEEA' },
  { id: 'rabbit', name: '토끼', emoji: '🐰', color: '#F48FB1' },
  { id: 'bear', name: '곰', emoji: '🐻', color: '#FFCC80' },
  { id: 'fox', name: '여우', emoji: '🦊', color: '#FFD54F' },
  { id: 'panda', name: '판다', emoji: '🐼', color: '#C5E1A5' },
];

export default function QuickCount() {
  const { code } = useParams();
  const [setupMode, setSetupMode] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<Player[]>([]);
  const [showShare, setShowShare] = useState(false);

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(labelId)) {
        newSet.delete(labelId);
      } else {
        newSet.add(labelId);
      }
      return newSet;
    });
  };

  const startCounting = () => {
    const selected = PRESET_LABELS.filter(label => selectedLabels.has(label.id));
    const newPlayers: Player[] = selected.map(label => ({
      id: label.id,
      name: label.name,
      emoji: label.emoji,
      color: label.color,
      count: 0,
    }));
    setPlayers(newPlayers);
    setSetupMode(false);
  };

  const handleIncrement = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, count: p.count + 1 } : p
    ));
  };

  const handleDecrement = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, count: Math.max(0, p.count - 1) } : p
    ));
  };

  if (setupMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chart-1/20 via-background to-chart-2/20 p-6">
        <div className="max-w-4xl mx-auto space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">참가자 선택</h1>
            <p className="text-muted-foreground">함께 카운팅할 사람들을 선택하세요</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PRESET_LABELS.map((label) => {
              const isSelected = selectedLabels.has(label.id);
              return (
                <Card
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 relative ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ borderColor: isSelected ? label.color : undefined }}
                  data-testid={`label-${label.id}`}
                >
                  {isSelected && (
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: label.color }}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{label.emoji}</div>
                    <div className="font-medium">{label.name}</div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Button
            onClick={startCounting}
            disabled={selectedLabels.size === 0}
            className="w-full"
            size="lg"
            data-testid="button-start-counting"
          >
            카운팅 시작 ({selectedLabels.size}명)
          </Button>
        </div>
      </div>
    );
  }

  const gridCols = players.length <= 2 ? 'grid-cols-1' : 
                   players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">카운팅</h1>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowShare(true)}
            data-testid="button-quick-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className={`grid ${gridCols} gap-4 max-w-4xl mx-auto`}>
          {players.map((player) => (
            <PlayerButton
              key={player.id}
              id={player.id}
              name={`${player.emoji} ${player.name}`}
              color={player.color}
              count={player.count}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ))}
        </div>
      </div>

      {showShare && <ShareDialog roomCode={code || 'ABC123'} onClose={() => setShowShare(false)} />}
    </div>
  );
}
