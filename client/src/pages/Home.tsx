import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Users, Clock, Share2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  const [roomName, setRoomName] = useState('');

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLocation(`/room/${code}/setup`);
  };

  const recentRooms = [
    { code: 'ABC123', name: '주말가족게임', players: 3, time: '5분 전' },
    { code: 'XYZ789', name: '회식모임', players: 5, time: '1시간 전' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-chart-1/20 via-background to-chart-2/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            CountNow
          </h1>
          <p className="text-xl text-muted-foreground">
            즉흥 카운팅 게임 - 10초만에 시작하기
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">방 이름 (선택)</label>
            <Input
              placeholder="예: 주말가족게임"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              data-testid="input-room-name"
            />
          </div>

          <Button
            onClick={createRoom}
            className="w-full"
            size="lg"
            data-testid="button-create-room"
          >
            <Play className="h-5 w-5 mr-2" />
            바로 시작하기
          </Button>
        </Card>

        {recentRooms.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">최근 방</h2>
            <div className="space-y-3">
              {recentRooms.map((room) => (
                <Card
                  key={room.code}
                  className="p-4 cursor-pointer hover-elevate"
                  onClick={() => setLocation(`/room/${room.code}`)}
                  data-testid={`card-recent-room-${room.code}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{room.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.players}명
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {room.time}
                        </span>
                      </div>
                    </div>
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center space-y-4 pt-8">
          <h3 className="text-lg font-bold">어떻게 사용하나요?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-bold mb-1">방 만들기</h4>
              <p className="text-sm text-muted-foreground">10초만에 게임방 생성</p>
            </Card>
            <Card className="p-4">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-bold mb-1">참가자 등록</h4>
              <p className="text-sm text-muted-foreground">가족, 친구 이름 추가</p>
            </Card>
            <Card className="p-4">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-bold mb-1">카운트 시작</h4>
              <p className="text-sm text-muted-foreground">실시간으로 점수 기록</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
