import { useState } from 'react';
import PlayerButton from '../PlayerButton';

export default function PlayerButtonExample() {
  const [counts, setCounts] = useState({ player1: 0, player2: 3, player3: 7 });

  const handleIncrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: prev[id as keyof typeof prev] + 1 }));
  };

  const handleDecrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id as keyof typeof prev] - 1) }));
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <PlayerButton
        id="player1"
        name="엄마 👩"
        color="#FF8A80"
        count={counts.player1}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <PlayerButton
        id="player2"
        name="아빠 👨"
        color="#80D8FF"
        count={counts.player2}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <PlayerButton
        id="player3"
        name="아들 👦"
        color="#A7FFEB"
        count={counts.player3}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    </div>
  );
}
