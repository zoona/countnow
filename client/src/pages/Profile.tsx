import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Home, Check, Edit2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { getCurrentProfile, upsertProfile, type UserProfile } from '@/lib/auth';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [emoji, setEmoji] = useState('😊');
  const [color, setColor] = useState('#81C784');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const p = await getCurrentProfile();
        if (!mounted) return;
        setProfile(p);
        setDisplayName(p?.display_name || p?.name || '');
        setEmoji(p?.emoji || '😊');
        setColor(p?.color || '#81C784');
      } catch (e) {
        // noop
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await upsertProfile({
        id: profile.id,
        name: profile.name,
        display_name: displayName.trim() || profile.name,
        emoji: emoji || '😊',
        color: color || '#81C784',
      });
    } finally {
      setSaving(false);
    }
  };

  const presetColors = [
    '#81C784', '#FF8A80', '#80D8FF', '#CE93D8', '#A7FFEB', '#FFB3E6',
    '#B3E0FF', '#FFE082', '#BCAAA4', '#A5D6A7', '#90CAF9', '#FFAB91',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/')}
            title="홈으로"
            data-testid="button-home"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">내 프로필 편집</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                style={{ backgroundColor: color }}
                aria-label="프로필 미리보기"
                data-testid="avatar-preview"
              >
                {emoji}
              </div>
              <div className="flex-1">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="이름"
                  className="h-10"
                  data-testid="input-display-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">이모지</label>
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="h-10"
                data-testid="input-emoji"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">색상</label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-8 rounded-full border ${color === c ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: c }}
                    aria-label={`색상 ${c}`}
                    data-testid={`button-color-${c}`}
                  />
                ))}
              </div>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10"
                data-testid="input-color"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSave}
                disabled={saving || !profile}
                title="저장"
                data-testid="button-save-profile"
              >
                <Check className="h-4 w-4 mr-2" /> 저장
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


