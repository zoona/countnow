import { useState, useRef, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

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
    onDecrement(id);
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

  // + 버튼 색상에서 어두운 버전 생성
  const darkerColor = `color-mix(in srgb, ${color} 70%, black)`;
  
  return (
    <div className="space-y-2">
      {/* Count display (consistent with SoloCount: large number above) */}
      <div className="w-full flex items-center justify-center">
        <span
          className="text-5xl font-extrabold text-foreground"
          data-testid={`text-player-count-${id}`}
        >
          {count}
        </span>
      </div>

      <button
        onClick={handleIncrementClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
          relative w-full min-h-32 rounded-3xl p-6 flex flex-col items-center justify-center gap-3
          transition-transform active:scale-95 shadow-lg hover-elevate active-elevate-2
          ${isLongPressing ? 'ring-4 ring-offset-2 ring-white animate-pulse' : ''}
        `}
        style={{ backgroundColor: color }}
        data-testid={`button-player-${id}`}
        aria-label={`${name} 증가`}
      >
        <span
          className="text-white text-lg font-bold drop-shadow-md"
          data-testid={`text-player-name-${id}`}
        >
          {name}
        </span>
        <Plus className="h-10 w-10 text-white drop-shadow-lg" />
      </button>
      
      <button
        onClick={handleDecrementClick}
        onTouchEnd={handleDecrementClick}
        disabled={count === 0}
        className="w-full h-16 rounded-3xl shadow-lg hover-elevate active-elevate-2 
                   flex items-center justify-center transition-transform active:scale-95
                   disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: count === 0 ? '#999' : darkerColor,
        }}
        data-testid={`button-player-decrement-${id}`}
        aria-label={`${name} 감소`}
      >
        <Minus className="h-6 w-6 text-white drop-shadow-md" />
      </button>
    </div>
  );
}
