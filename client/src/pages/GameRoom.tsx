import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, StopCircle } from 'lucide-react';
import { useParams } from 'wouter';
import PlayerButton from '@/components/PlayerButton';
import TimerDisplay from '@/components/TimerDisplay';
import EventLog from '@/components/EventLog';
import ResultsScreen from '@/components/ResultsScreen';
import PenaltyWheel from '@/components/PenaltyWheel';
import ShareDialog from '@/components/ShareDialog';

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

interface Event {
  id: string;
  playerName: string;
  delta: number;
  timestamp: string;
}

export default function GameRoom() {
  const { code } = useParams();
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '엄마', emoji: '👩', color: '#FF8A80', count: 0 },
    { id: '2', name: '아빠', emoji: '👨', color: '#80D8FF', count: 0 },
    { id: '3', name: '아들', emoji: '👦', color: '#A7FFEB', count: 0 },
  ]);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleIncrement = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, count: p.count + 1 } : p
    ));

    const now = new Date();
    const timestamp = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setEvents(prev => [
      { id: Date.now().toString(), playerName: `${player.emoji} ${player.name}`, delta: 1, timestamp },
      ...prev
    ]);
  };

  const handleDecrement = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.count === 0) return;

    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, count: Math.max(0, p.count - 1) } : p
    ));

    const now = new Date();
    const timestamp = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setEvents(prev => [
      { id: Date.now().toString(), playerName: `${player.emoji} ${player.name}`, delta: -1, timestamp },
      ...prev
    ]);
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setPlayers(prev => prev.map(p => ({ ...p, count: 0 })));
    setEvents([]);
    setShowResults(false);
  };

  const results = [...players]
    .sort((a, b) => b.count - a.count)
    .map((player, index, arr) => ({
      ...player,
      rank: index === 0 ? 1 : arr[index - 1].count === player.count ? arr.findIndex(p => p.count === player.count) + 1 : index + 1
    }));

  const gridCols = players.length <= 2 ? 'grid-cols-1' : players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

  if (showResults) {
    return (
      <>
        <ResultsScreen
          results={results}
          onPlayAgain={handlePlayAgain}
          onRandomPenalty={() => setShowPenalty(true)}
        />
        {showPenalty && <PenaltyWheel onClose={() => setShowPenalty(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TimerDisplay totalSeconds={180} onComplete={handleFinish} />

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

        <div className="max-w-4xl mx-auto mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowShare(true)}
            data-testid="button-share-room"
          >
            <Share2 className="h-5 w-5 mr-2" />
            공유
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleFinish}
            data-testid="button-finish-game"
          >
            <StopCircle className="h-5 w-5 mr-2" />
            종료
          </Button>
        </div>
      </div>

      <EventLog events={events} />
      
      {showShare && <ShareDialog roomCode={code || 'ABC123'} onClose={() => setShowShare(false)} />}
    </div>
  );
}
