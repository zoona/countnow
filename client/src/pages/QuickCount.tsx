import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings2, Share2 } from 'lucide-react';
import { useParams } from 'wouter';
import PlayerButton from '@/components/PlayerButton';
import ShareDialog from '@/components/ShareDialog';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

const COLORS = ['#FF8A80', '#80D8FF', '#A7FFEB', '#CE93D8', '#FFCC80', '#B39DDB'];
const EMOJIS = ['👩', '👨', '👧', '👦', '🧒', '👶', '🙋', '🙋‍♂️'];

export default function QuickCount() {
  const { code } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showShare, setShowShare] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

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

  const addPlayer = (name: string) => {
    if (!name.trim()) return;
    
    const usedColors = players.map(p => p.color);
    const availableColor = COLORS.find(c => !usedColors.includes(c)) || COLORS[0];
    
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: name.trim(),
      emoji: EMOJIS[players.length % EMOJIS.length],
      color: availableColor,
      count: 0,
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName('');
    setShowAddPlayer(false);
  };

  const gridCols = players.length === 0 ? 'grid-cols-1' : 
                   players.length <= 2 ? 'grid-cols-1' : 
                   players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">카운팅</h1>
          
          <div className="flex gap-2">
            <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" data-testid="button-open-add-player">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>참가자 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="이름 입력..."
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addPlayer(newPlayerName);
                      }
                    }}
                    data-testid="input-quick-player-name"
                  />
                  <Button 
                    onClick={() => addPlayer(newPlayerName)} 
                    className="w-full"
                    data-testid="button-confirm-add-player"
                  >
                    추가
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
      </div>

      <div className="flex-1 overflow-auto p-4">
        {players.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">👋</div>
              <h2 className="text-2xl font-bold">참가자를 추가하세요</h2>
              <p className="text-muted-foreground">
                카운팅을 시작하려면 먼저 참가자를 추가해주세요
              </p>
              <Button 
                onClick={() => setShowAddPlayer(true)} 
                size="lg"
                data-testid="button-add-first-player"
              >
                <Plus className="h-5 w-5 mr-2" />
                참가자 추가
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {showShare && <ShareDialog roomCode={code || 'ABC123'} onClose={() => setShowShare(false)} />}
    </div>
  );
}
