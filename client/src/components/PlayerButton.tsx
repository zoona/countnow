import { useState, useRef, useEffect } from 'react';
import { Minus } from 'lucide-react';

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

  const handleIncrementClick = () => {
    if (!isLongPressing) {
      onIncrement(id);
    }
  };

  const handleDecrementClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (count > 0) {
      onDecrement(id);
    }
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

  const handleTouchStart = () => {
    startLongPress();
  };

  const handleTouchEnd = () => {
    endLongPress();
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (incrementInterval.current) clearInterval(incrementInterval.current);
    };
  }, []);

  return (
    <div 
      className={`
        relative min-h-40 rounded-3xl shadow-lg overflow-hidden
        ${isLongPressing ? 'ring-4 ring-offset-2 ring-white animate-pulse' : ''}
      `}
      style={{ backgroundColor: color }}
    >
      {/* 상단 70% - 증가 영역 */}
      <button
        onClick={handleIncrementClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-[70%] flex flex-col items-center justify-center gap-2 
                   transition-transform active:scale-95"
        data-testid={`button-player-${id}`}
      >
        <span className="text-white text-lg font-bold drop-shadow-md" data-testid={`text-player-name-${id}`}>
          {name}
        </span>
        <span className="text-white text-6xl font-extrabold drop-shadow-lg" data-testid={`text-player-count-${id}`}>
          {count}
        </span>
      </button>
      
      {/* 하단 30% - 감소 영역 */}
      <button
        onClick={handleDecrementClick}
        onTouchEnd={handleDecrementClick}
        disabled={count === 0}
        className="w-full h-[30%] border-t border-white/20 flex items-center justify-center
                   transition-all hover:bg-black/10 active:bg-black/20
                   disabled:opacity-30 disabled:cursor-not-allowed"
        data-testid={`button-player-decrement-${id}`}
      >
        <Minus className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
