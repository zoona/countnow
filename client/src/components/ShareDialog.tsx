import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareDialogProps {
  roomCode: string;
  onClose: () => void;
}

export default function ShareDialog({ roomCode, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/room/${roomCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-background rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold">공유하기</h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onClose} 
            className="h-8 w-8 -mr-2"
            data-testid="button-close-share"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 본문 */}
        <div className="px-6 pb-6 space-y-6">
          {/* QR 코드 */}
          <div className="flex justify-center p-6 bg-white rounded-xl">
            <QRCodeSVG 
              value={shareUrl} 
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* 방 코드 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              방 코드
            </label>
            <Input 
              value={roomCode} 
              readOnly 
              className="text-center text-2xl font-bold tracking-widest h-12 rounded-xl"
              data-testid="input-room-code"
            />
          </div>

          {/* 공유 링크 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              공유 링크
            </label>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly
                className="text-sm rounded-xl"
                data-testid="input-share-url"
              />
              <Button 
                onClick={copyToClipboard}
                variant={copied ? "default" : "outline"}
                className="shrink-0 rounded-xl"
                data-testid="button-copy-link"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    복사
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 안내 문구 */}
          <p className="text-center text-xs text-muted-foreground">
            링크나 QR 코드를 공유하여 다른 사람을 초대하세요
          </p>
        </div>
      </div>
    </div>
  );
}
