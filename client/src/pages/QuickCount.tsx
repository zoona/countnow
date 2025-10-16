import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Share2, Edit2, Plus, X, Smile, RotateCcw, Home, UserPlus, MoreVertical } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import PlayerButton from '@/components/PlayerButton';
import ShareDialog from '@/components/ShareDialog';
import { saveSession, getSession, subscribeToSession } from '@/lib/supabaseStorage';
import { getCustomParticipants, addCustomParticipant, deleteCustomParticipant } from '@/lib/customParticipants';
import { getCurrentProfile, type UserProfile } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
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

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

interface PresetLabel {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface LabelGroup {
  title: string;
  labels: PresetLabel[];
}

const COLOR_POOL = [
  '#81C784', '#FF8A80', '#80D8FF', '#CE93D8', '#A7FFEB', '#FFB3E6',
  '#B3E0FF', '#FFE082', '#BCAAA4', '#A5D6A7', '#90CAF9', '#FFAB91',
  '#80DEEA', '#F48FB1', '#FFCC80', '#FFD54F', '#C5E1A5'
];

const LABEL_GROUPS: LabelGroup[] = [
  {
    title: '나',
    labels: [
      { id: 'me', name: '나', emoji: '😊', color: '#81C784' },
    ]
  },
  {
    title: '가족',
    labels: [
      { id: 'mom', name: '엄마', emoji: '👩', color: '#FF8A80' },
      { id: 'dad', name: '아빠', emoji: '👨', color: '#80D8FF' },
      { id: 'sister', name: '누나', emoji: '👧', color: '#CE93D8' },
      { id: 'brother', name: '형', emoji: '👦', color: '#A7FFEB' },
      { id: 'younger-sister', name: '여동생', emoji: '👧', color: '#FFB3E6' },
      { id: 'younger-brother', name: '남동생', emoji: '👦', color: '#B3E0FF' },
    ]
  },
  {
    title: '번호',
    labels: [
      { id: 'student1', name: '1번', emoji: '1️⃣', color: '#FFE082' },
      { id: 'student2', name: '2번', emoji: '2️⃣', color: '#BCAAA4' },
      { id: 'student3', name: '3번', emoji: '3️⃣', color: '#CE93D8' },
      { id: 'student4', name: '4번', emoji: '4️⃣', color: '#A5D6A7' },
      { id: 'student5', name: '5번', emoji: '5️⃣', color: '#90CAF9' },
      { id: 'student6', name: '6번', emoji: '6️⃣', color: '#FFAB91' },
    ]
  },
  {
    title: '동물',
    labels: [
      { id: 'cat', name: '고양이', emoji: '🐱', color: '#FFAB91' },
      { id: 'dog', name: '강아지', emoji: '🐶', color: '#80DEEA' },
      { id: 'rabbit', name: '토끼', emoji: '🐰', color: '#F48FB1' },
      { id: 'bear', name: '곰', emoji: '🐻', color: '#FFCC80' },
      { id: 'fox', name: '여우', emoji: '🦊', color: '#FFD54F' },
      { id: 'panda', name: '판다', emoji: '🐼', color: '#C5E1A5' },
    ]
  },
];

export default function QuickCount() {
  const { code } = useParams();
  const [, setLocation] = useLocation();
  const [setupMode, setSetupMode] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<Player[]>([]);
  const [title, setTitle] = useState(new Date().toLocaleDateString('ko-KR'));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [customParticipants, setCustomParticipants] = useState<PresetLabel[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastLocalChangeAt = useRef<number>(0);

  // Load session and profile from Supabase
  useEffect(() => {
    const loadData = async () => {
      // Load custom participants
      const participants = await getCustomParticipants();
      // Convert CustomParticipant to PresetLabel format
      const presetParticipants: PresetLabel[] = participants.map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
      }));
      setCustomParticipants(presetParticipants);

      // Load user profile
      const profile = await getCurrentProfile();
      setMyProfile(profile);

      // Load session if code exists
      if (code) {
        const saved = await getSession(code);
        if (saved && saved.type === 'multi') {
          setPlayers(saved.players);
          setTitle(saved.title || new Date().toLocaleDateString('ko-KR'));
          setSetupMode(saved.players.length === 0);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [code]);

  // Subscribe to realtime updates (temporarily disabled for stability)
  useEffect(() => {
    return; // TODO: re-enable after resolving oscillation issue
  }, [code, setupMode, players]);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('😊');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Update custom emoji when participants load
  useEffect(() => {
    if (customParticipants.length > 0) {
      setCustomEmoji(getRandomEmoji());
    }
  }, []);

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(labelId)) {
        newSet.delete(labelId);
      } else {
        newSet.add(labelId);
      }
      return newSet;
    });
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setCustomEmoji(emojiData.emoji);
    setEmojiPickerOpen(false);
  };

  const getRandomEmoji = () => {
    const allEmojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥'
    ];
    
    // 현재 커스텀 참가자들이 사용 중인 이모지들
    const usedEmojis = customParticipants.map(p => p.emoji);
    
    // 사용되지 않은 이모지들만 필터링
    const availableEmojis = allEmojis.filter(emoji => !usedEmojis.includes(emoji));
    
    // 사용 가능한 이모지가 있으면 랜덤 선택, 없으면 기본 이모지
    return availableEmojis.length > 0 
      ? availableEmojis[Math.floor(Math.random() * availableEmojis.length)]
      : '😊';
  };

  const addCustomParticipantHandler = async () => {
    const name = customName.trim();
    const emoji = customEmoji.trim();
    
    if (!name || !emoji) return;
    
    const color = COLOR_POOL[customParticipants.length % COLOR_POOL.length];

    try {
      const newParticipant = await addCustomParticipant({
        name,
        emoji,
        color,
      });

      const participants = await getCustomParticipants();
      const presetParticipants: PresetLabel[] = participants.map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
      }));
      setCustomParticipants(presetParticipants);
      
      if (newParticipant) {
        setSelectedLabels(prev => new Set([...Array.from(prev), newParticipant.id]));
      }
      
      setCustomName('');
      setCustomEmoji(getRandomEmoji());
    } catch (error) {
      console.error('Failed to add participant:', error);
    }
  };

  const removeCustomParticipant = async (id: string) => {
    try {
      await deleteCustomParticipant(id);
      const participants = await getCustomParticipants();
      const presetParticipants: PresetLabel[] = participants.map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
      }));
      setCustomParticipants(presetParticipants);
      setSelectedLabels(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
  };

  const startCounting = () => {
    // 내 프로필, 커스텀 참가자, 프리셋 라벨 모두 포함
    const allLabels: PresetLabel[] = [
      ...(myProfile ? [{
        id: myProfile.id,
        name: myProfile.display_name || myProfile.name,
        emoji: myProfile.emoji,
        color: myProfile.color,
      }] : []),
      ...customParticipants,
      ...LABEL_GROUPS.flatMap(group => group.labels)
    ];
    
    const selected = allLabels.filter(label => selectedLabels.has(label.id));
    const newPlayers: Player[] = selected.map(label => ({
      id: label.id,
      name: label.name,
      emoji: label.emoji,
      color: label.color,
      count: 0,
    }));
    setPlayers(newPlayers);
    setSetupMode(false);
  };

  const handleIncrement = (playerId: string) => {
    lastLocalChangeAt.current = Date.now();
    setPlayers(prev => prev.map(p => (
      p.id === playerId ? { ...p, count: p.count + 1 } : p
    )));
  };

  const handleDecrement = (playerId: string) => {
    lastLocalChangeAt.current = Date.now();
    setPlayers(prev => prev.map(p => (
      p.id === playerId ? { ...p, count: Math.max(0, p.count - 1) } : p
    )));
  };

  const resetAllCounts = () => {
    lastLocalChangeAt.current = Date.now();
    setPlayers(prev => prev.map(p => ({ ...p, count: 0 })));
  };

  // Debounced autosave instead of fixed interval to avoid race with realtime
  useEffect(() => {
    if (!code || setupMode) return;
    const t = setTimeout(() => {
      saveSession({
        code,
        type: 'multi',
        players,
        timestamp: Date.now(),
        title: title || undefined,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [players, title, code, setupMode]);

  const handleTitleSave = () => {
    const trimmedTitle = title.trim();
    setTitle(trimmedTitle);
    setIsEditingTitle(false);
    
    if (code) {
      saveSession({
        code,
        type: 'multi',
        players,
        timestamp: Date.now(),
        title: trimmedTitle || undefined,
      });
    }
  };

  useEffect(() => {
    if (!code || setupMode || players.length === 0) return;

    const save = () => {
      saveSession({
        code,
        type: 'multi',
        players,
        timestamp: Date.now(),
        title: title || undefined,
      });
    };

    const interval = setInterval(save, 2000);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [code, players, setupMode, title]);

  if (setupMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chart-1/20 via-background to-chart-2/20 flex flex-col">
        <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLocation('/')}
                title="홈으로"
                data-testid="button-home"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex-1 text-center space-y-1">
                <h1 className="text-2xl font-bold">함께할 사람</h1>
                <p className="text-sm text-muted-foreground">같이 숫자 세기를 할 사람들을 선택하세요</p>
              </div>
              <div className="w-10"></div>
            </div>
            
            <div className="flex gap-2">
              <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-16 text-xl p-0"
                    data-testid="button-emoji-picker"
                  >
                    {customEmoji || <Smile className="h-5 w-5" />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0" align="start">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </PopoverContent>
              </Popover>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCustomParticipantHandler();
                  }
                }}
                placeholder="이름 입력"
                className="flex-1"
                data-testid="input-custom-name"
              />
              <Button
                onClick={addCustomParticipantHandler}
                disabled={!customName.trim() || !customEmoji.trim()}
                size="icon"
                data-testid="button-add-custom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={startCounting}
              disabled={selectedLabels.size === 0}
              className="w-full"
              size="lg"
              data-testid="button-start-counting"
            >
              세기 시작 ({selectedLabels.size}명)
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {myProfile && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  내 프로필 (빠른 추가)
                </h3>
                <Card
                  className={`p-4 transition-all hover-elevate active-elevate-2 cursor-pointer ${
                    selectedLabels.has(myProfile.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ borderColor: selectedLabels.has(myProfile.id) ? myProfile.color : undefined }}
                  onClick={() => toggleLabel(myProfile.id)}
                  data-testid="card-my-profile"
                >
                  {selectedLabels.has(myProfile.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white bg-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                      style={{ backgroundColor: myProfile.color }}
                    >
                      {myProfile.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{myProfile.display_name || myProfile.name}</p>
                      <p className="text-xs text-muted-foreground">나</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {customParticipants.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">추가한 사람</h3>
                <div className="grid grid-cols-3 gap-2">
                  {customParticipants.map((label) => {
                    const isSelected = selectedLabels.has(label.id);
                    return (
                      <Card
                        key={label.id}
                        className={`p-2.5 transition-all hover-elevate active-elevate-2 relative ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ borderColor: isSelected ? label.color : undefined }}
                        data-testid={`label-${label.id}`}
                      >
                        <div className="cursor-pointer" onClick={() => toggleLabel(label.id)}>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white bg-green-500">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <div className="flex flex-col items-center gap-1 pb-8">
                            <div className="text-2xl">{label.emoji}</div>
                            <div className="text-xs font-medium text-center">{label.name}</div>
                          </div>
                        </div>
                        <div className="pt-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomParticipant(label.id);
                            }}
                            className="w-full h-6 px-2 text-xs rounded-t-none"
                            data-testid={`button-remove-${label.id}`}
                          >
                            <X className="h-3 w-3 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {LABEL_GROUPS.map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1">{group.title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.labels.map((label) => {
                    const isSelected = selectedLabels.has(label.id);
                    return (
                      <Card
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className={`p-2.5 cursor-pointer transition-all hover-elevate active-elevate-2 relative ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ borderColor: isSelected ? label.color : undefined }}
                        data-testid={`label-${label.id}`}
                      >
                        {isSelected && (
                          <div 
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white bg-green-500"
                          >
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-2xl">{label.emoji}</div>
                          <div className="text-xs font-medium text-center">{label.name}</div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const gridCols = players.length <= 2 ? 'grid-cols-1' : 
                   players.length <= 6 ? 'grid-cols-2' : 'grid-cols-3';

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
                  같이 세기
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
              data-testid="button-quick-share"
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
                      모든 숫자 리셋
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>모든 숫자를 리셋하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        모든 참가자의 숫자가 0으로 초기화됩니다. 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={resetAllCounts}>리셋</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

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
      </div>

      {showShare && <ShareDialog roomCode={code || 'ABC123'} onClose={() => setShowShare(false)} />}
    </div>
  );
}
