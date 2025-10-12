import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface Player {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

interface PlayerSetupProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
}

const COLORS = [
  { value: '#FF8A80', label: 'Coral' },
  { value: '#80D8FF', label: 'Sky Blue' },
  { value: '#A7FFEB', label: 'Mint' },
  { value: '#CE93D8', label: 'Purple' },
  { value: '#FFCC80', label: 'Peach' },
  { value: '#B39DDB', label: 'Lavender' },
];

const EMOJIS = ['👩', '👨', '👧', '👦', '🧒', '👶', '🙋', '🙋‍♂️'];

const PRESETS = [
  { name: '엄마', emoji: '👩' },
  { name: '아빠', emoji: '👨' },
  { name: '딸', emoji: '👧' },
  { name: '아들', emoji: '👦' },
];

export default function PlayerSetup({ players, onPlayersChange }: PlayerSetupProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = (name: string, emoji: string) => {
    if (!name.trim()) return;
    
    const usedColors = players.map(p => p.color);
    const availableColor = COLORS.find(c => !usedColors.includes(c.value))?.value || COLORS[0].value;
    
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: name.trim(),
      color: availableColor,
      emoji,
    };
    
    onPlayersChange([...players, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    onPlayersChange(players.filter(p => p.id !== id));
  };

  const updatePlayerColor = (id: string, color: string) => {
    onPlayersChange(players.map(p => p.id === id ? { ...p, color } : p));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">참가자 등록</h2>
        <p className="text-sm text-muted-foreground">게임에 참여할 사람들을 추가하세요</p>
      </div>

      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => addPlayer(preset.name, preset.emoji)}
            data-testid={`button-preset-${preset.name}`}
          >
            {preset.emoji} {preset.name}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <Card key={player.id} className="p-4" data-testid={`card-player-${player.id}`}>
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{player.emoji}</span>
                  <span className="font-medium" data-testid={`text-player-setup-name-${player.id}`}>
                    {player.name}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updatePlayerColor(player.id, color.value)}
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                        player.color === color.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      data-testid={`button-color-${player.id}-${color.value}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removePlayer(player.id)}
                data-testid={`button-remove-player-${player.id}`}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="이름 입력..."
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addPlayer(newPlayerName, EMOJIS[players.length % EMOJIS.length]);
            }
          }}
          data-testid="input-new-player-name"
        />
        <Button
          onClick={() => addPlayer(newPlayerName, EMOJIS[players.length % EMOJIS.length])}
          data-testid="button-add-player"
        >
          <Plus className="h-5 w-5 mr-2" />
          추가
        </Button>
      </div>
    </div>
  );
}
