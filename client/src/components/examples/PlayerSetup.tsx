import { useState } from 'react';
import PlayerSetup from '../PlayerSetup';

export default function PlayerSetupExample() {
  const [players, setPlayers] = useState([
    { id: '1', name: '엄마', color: '#FF8A80', emoji: '👩' },
    { id: '2', name: '아빠', color: '#80D8FF', emoji: '👨' },
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <PlayerSetup players={players} onPlayersChange={setPlayers} />
    </div>
  );
}
