import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Minus } from 'lucide-react';
import { useParams } from 'wouter';
import ShareDialog from '@/components/ShareDialog';
import { saveSession, getSession } from '@/lib/storage';

export default function SoloCount() {
  const { code } = useParams();
  const [count, setCount] = useState(() => {
    if (code) {
      const saved = getSession(code);
      if (saved && saved.type === 'solo') {
        return saved.count;
      }
    }
    return 0;
  });
  const [showShare, setShowShare] = useState(false);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  const mainColor = '#80D8FF';
  const darkerColor = `color-mix(in srgb, ${mainColor} 70%, black)`;

  useEffect(() => {
    if (!code) return;

    const save = () => {
      saveSession({
        code,
        type: 'solo',
        count,
        timestamp: Date.now(),
      });
    };

    const interval = setInterval(save, 2000);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [code, count]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">카운팅</h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowShare(true)}
              data-testid="button-solo-share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              data-testid="button-solo-reset"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <div className="text-9xl font-extrabold mb-4" data-testid="text-solo-count">
              {count}
            </div>
            <p className="text-muted-foreground">탭해서 카운트 증가</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={increment}
              className="w-full min-h-32 rounded-3xl p-6 flex items-center justify-center
                       transition-transform active:scale-95 shadow-lg hover-elevate active-elevate-2"
              style={{ backgroundColor: mainColor }}
              data-testid="button-solo-increment"
            >
              <span className="text-6xl font-extrabold text-white drop-shadow-lg">+</span>
            </button>

            <button
              onClick={decrement}
              disabled={count === 0}
              className="w-full min-h-12 rounded-2xl shadow-md hover-elevate active-elevate-2 
                       flex items-center justify-center transition-transform active:scale-95
                       disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: count === 0 ? '#999' : darkerColor,
              }}
              data-testid="button-solo-decrement"
            >
              <Minus className="h-6 w-6 text-white drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {showShare && <ShareDialog roomCode={code || 'ABC123'} onClose={() => setShowShare(false)} />}
    </div>
  );
}
