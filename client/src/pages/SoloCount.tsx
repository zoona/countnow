import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Minus, Edit2, Check, Home, MoreVertical } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import ShareDialog from '@/components/ShareDialog';
import { saveSession, getSession, subscribeToSession } from '@/lib/supabaseStorage';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SoloCount() {
  const { code } = useParams();
  const [, setLocation] = useLocation();
  const [startedAt] = useState(Date.now());
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState(new Date().toLocaleDateString('ko-KR'));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from Supabase
  useEffect(() => {
    if (!code) {
      setIsLoading(false);
      return;
    }

    const loadSession = async () => {
      const saved = await getSession(code);
      if (saved && saved.type === 'solo') {
        setCount(saved.count);
        setTitle(saved.title || new Date().toLocaleDateString('ko-KR'));
      }
      setIsLoading(false);
    };

    loadSession();
  }, [code]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!code) return;

    const unsubscribe = subscribeToSession(code, (session) => {
      if (session.type === 'solo') {
        setCount(session.count);
        setTitle(session.title || new Date().toLocaleDateString('ko-KR'));
      }
    });

    return unsubscribe;
  }, [code]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  const mainColor = '#80D8FF';
  const darkerColor = `color-mix(in srgb, ${mainColor} 70%, black)`;

  const handleTitleSave = () => {
    const trimmedTitle = title.trim();
    setTitle(trimmedTitle);
    setIsEditingTitle(false);
    
    if (code) {
      saveSession({
        code,
        type: 'solo',
        count,
        timestamp: Date.now(),
        title: trimmedTitle || undefined,
      });
    }
  };

  useEffect(() => {
    if (!code) return;

    const save = () => {
      saveSession({
        code,
        type: 'solo',
        count,
        timestamp: Date.now(),
        title: title || undefined,
      });
    };

    const interval = setInterval(save, 2000);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [code, count, title]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/')}
            className="flex-shrink-0"
            title="홈으로"
            data-testid="button-home"
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
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
                  {title}
                </h1>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  혼자 세기
                </span>
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
          
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowShare(true)}
              title="공유하기"
              data-testid="button-solo-share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  title="더보기"
                  data-testid="button-more-menu"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      숫자 리셋
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>숫자를 리셋하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        현재 숫자({count})가 0으로 초기화됩니다. 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={reset}>리셋</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <div className="text-9xl font-extrabold mb-4" data-testid="text-solo-count">
              {count}
            </div>
            <p className="text-muted-foreground">탭해서 숫자 증가</p>
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
              className="w-full h-16 rounded-3xl shadow-lg hover-elevate active-elevate-2 
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
