import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createProfile } from '@/lib/auth';
import { migrateLocalParticipantsToCloud } from '@/lib/customParticipants';
import { useLocation } from 'wouter';

const PRESET_EMOJIS = ['😊', '🙂', '😄', '😎', '🥳', '🤗', '😇', '🤠', '🥰', '😺', '🐶', '🐼', '🦊', '🐻', '🐨', '🦁'];
const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52BE80',
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      
      // 프로필 생성
      await createProfile({
        name: name.trim(),
        display_name: name.trim(),
        emoji: selectedEmoji,
        color: selectedColor,
      });

      // localStorage 데이터 마이그레이션
      await migrateLocalParticipantsToCloud();

      // 홈으로 이동
      setLocation('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('프로필 설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">환영합니다! 🎉</h1>
          <p className="text-muted-foreground">
            프로필을 설정하고 시작하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 이름 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">이름</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="h-12 text-lg"
              maxLength={20}
              data-testid="input-profile-name"
            />
          </div>

          {/* 이모지 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">프로필 이모지</label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`h-12 text-2xl rounded-xl transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-primary text-primary-foreground scale-110'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  data-testid={`button-emoji-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">프로필 색상</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-12 rounded-xl transition-all ${
                    selectedColor === color
                      ? 'ring-4 ring-primary ring-offset-2 scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  data-testid={`button-color-${color}`}
                />
              ))}
            </div>
          </div>

          {/* 미리보기 */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2 text-center">미리보기</p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: selectedColor }}
              >
                {selectedEmoji}
              </div>
              <div>
                <p className="font-semibold text-lg">{name || '이름'}</p>
                <p className="text-sm text-muted-foreground">나</p>
              </div>
            </div>
          </Card>
        </div>

        <Button
          onClick={handleComplete}
          disabled={loading || !name.trim()}
          className="w-full h-14 text-lg"
          data-testid="button-complete-onboarding"
        >
          {loading ? '설정 중...' : '시작하기'}
        </Button>
      </Card>
    </div>
  );
}

