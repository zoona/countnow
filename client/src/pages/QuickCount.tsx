import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Share2, Edit2 } from 'lucide-react';
import { useParams } from 'wouter';
import PlayerButton from '@/components/PlayerButton';
import ShareDialog from '@/components/ShareDialog';
import { saveSession, getSession } from '@/lib/storage';
import { Input } from '@/components/ui/input';

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

interface LabelGroup {
  title: string;
  labels: PresetLabel[];
}

const LABEL_GROUPS: LabelGroup[] = [
  {
    title: '나',
    labels: [
      { id: 'me', name: '나', emoji: '😊', color: '#81C784' },
    ]
  },
  {
    title: '가족',
    labels: [
      { id: 'mom', name: '엄마', emoji: '👩', color: '#FF8A80' },
      { id: 'dad', name: '아빠', emoji: '👨', color: '#80D8FF' },
      { id: 'sister', name: '누나', emoji: '👧', color: '#CE93D8' },
      { id: 'brother', name: '형', emoji: '👦', color: '#A7FFEB' },
      { id: 'younger-sister', name: '여동생', emoji: '👧', color: '#FFB3E6' },
      { id: 'younger-brother', name: '남동생', emoji: '👦', color: '#B3E0FF' },
    ]
  },
  {
    title: '번호',
    labels: [
      { id: 'student1', name: '1번', emoji: '1️⃣', color: '#FFE082' },
      { id: 'student2', name: '2번', emoji: '2️⃣', color: '#BCAAA4' },
      { id: 'student3', name: '3번', emoji: '3️⃣', color: '#CE93D8' },
      { id: 'student4', name: '4번', emoji: '4️⃣', color: '#A5D6A7' },
      { id: 'student5', name: '5번', emoji: '5️⃣', color: '#90CAF9' },
      { id: 'student6', name: '6번', emoji: '6️⃣', color: '#FFAB91' },
    ]
  },
  {
    title: '동물',
    labels: [
      { id: 'cat', name: '고양이', emoji: '🐱', color: '#FFAB91' },
      { id: 'dog', name: '강아지', emoji: '🐶', color: '#80DEEA' },
      { id: 'rabbit', name: '토끼', emoji: '🐰', color: '#F48FB1' },
      { id: 'bear', name: '곰', emoji: '🐻', color: '#FFCC80' },
      { id: 'fox', name: '여우', emoji: '🦊', color: '#FFD54F' },
      { id: 'panda', name: '판다', emoji: '🐼', color: '#C5E1A5' },
    ]
  },
];

export default function QuickCount() {
  const { code } = useParams();
  const [setupMode, setSetupMode] = useState(() => {
    if (code) {
      const saved = getSession(code);
      return !saved || saved.type !== 'multi' || saved.players.length === 0;
    }
    return true;
  });
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<Player[]>(() => {
    if (code) {
      const saved = getSession(code);
      if (saved && saved.type === 'multi') {
        return saved.players;
      }
    }
    return [];
  });
  const [title, setTitle] = useState(() => {
    if (code) {
      const saved = getSession(code);
      if (saved && saved.type === 'multi') {
        return saved.title || '';
      }
    }
    return '';
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
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
    const allLabels = LABEL_GROUPS.flatMap(group => group.labels);
    const selected = allLabels.filter(label => selectedLabels.has(label.id));
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

  const handleTitleSave = () => {
    const trimmedTitle = title.trim();
    setTitle(trimmedTitle);
    setIsEditingTitle(false);
    
    if (code) {
      saveSession({
        code,
        type: 'multi',
        players,
        timestamp: Date.now(),
        title: trimmedTitle || undefined,
      });
    }
  };

  useEffect(() => {
    if (!code || setupMode || players.length === 0) return;

    const save = () => {
      saveSession({
        code,
        type: 'multi',
        players,
        timestamp: Date.now(),
        title: title || undefined,
      });
    };

    const interval = setInterval(save, 2000);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [code, players, setupMode, title]);

  if (setupMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chart-1/20 via-background to-chart-2/20 flex flex-col">
        <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">참가자 선택</h1>
              <p className="text-sm text-muted-foreground">함께 카운팅할 사람들을 선택하세요</p>
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

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {LABEL_GROUPS.map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">{group.title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.labels.map((label) => {
                    const isSelected = selectedLabels.has(label.id);
                    return (
                      <Card
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className={`p-2.5 cursor-pointer transition-all hover-elevate active-elevate-2 relative ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ borderColor: isSelected ? label.color : undefined }}
                        data-testid={`label-${label.id}`}
                      >
                        {isSelected && (
                          <div 
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: label.color }}
                          >
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-2xl">{label.emoji}</div>
                          <div className="text-xs font-medium text-center">{label.name}</div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
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
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">👥</span>
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSave();
                    }
                  }}
                  placeholder="제목 입력"
                  className="h-8"
                  autoFocus
                  data-testid="input-title"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTitleSave}
                  className="h-8 w-8"
                  data-testid="button-save-title"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate" data-testid="text-session-title">
                  {title || '여럿이 카운팅'}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingTitle(true)}
                  className="h-8 w-8 flex-shrink-0"
                  data-testid="button-edit-title"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowShare(true)}
            data-testid="button-quick-share"
            className="flex-shrink-0"
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
