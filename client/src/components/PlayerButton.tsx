import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface PlayerButtonProps {
  id: string;
  name: string;
  color: string;
  count: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function PlayerButton({ id, name, color, count, onIncrement, onDecrement }: PlayerButtonProps) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const incrementInterval = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      onIncrement(id);
      incrementInterval.current = setInterval(() => {
        onIncrement(id);
      }, 200);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (incrementInterval.current) {
      clearInterval(incrementInterval.current);
    }
    setIsLongPressing(false);
  };

  const handleClick = () => {
    if (!isLongPressing) {
      onIncrement(id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    startLongPress();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchCurrentX = e.touches[0].clientX;
      const diff = touchStartX - touchCurrentX;
      
      if (diff > 80) {
        endLongPress();
        onDecrement(id);
        setTouchStartX(null);
      }
    }
  };

  const handleTouchEnd = () => {
    endLongPress();
    setTouchStartX(null);
  };

  const handleMouseDown = () => {
    startLongPress();
  };

  const handleMouseUp = () => {
    endLongPress();
  };

  const handleMouseLeave = () => {
    endLongPress();
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (incrementInterval.current) clearInterval(incrementInterval.current);
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        relative min-h-28 rounded-3xl p-6 flex flex-col items-center justify-center gap-3
        transition-transform active:scale-95 shadow-lg hover-elevate active-elevate-2
        ${isLongPressing ? 'ring-4 ring-offset-2 animate-pulse' : ''}
      `}
      style={{ 
        backgroundColor: color,
      }}
      data-testid={`button-player-${id}`}
    >
      <span className="text-white text-lg font-bold drop-shadow-md" data-testid={`text-player-name-${id}`}>
        {name}
      </span>
      <span className="text-white text-6xl font-extrabold drop-shadow-lg" data-testid={`text-player-count-${id}`}>
        {count}
      </span>
    </button>
  );
}
