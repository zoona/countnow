import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Copy, QrCode, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareDialogProps {
  roomCode: string;
  onClose: () => void;
}

export default function ShareDialog({ roomCode, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/room/${roomCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">방 공유하기</h2>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-share">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">방 코드</label>
            <div className="flex gap-2">
              <Input 
                value={roomCode} 
                readOnly 
                className="text-center text-2xl font-bold tracking-wider"
                data-testid="input-room-code"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">공유 링크</label>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly
                data-testid="input-share-url"
              />
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                data-testid="button-copy-link"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="bg-muted rounded-2xl p-8 flex items-center justify-center">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              QR 코드로 쉽게 참여할 수 있습니다
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
