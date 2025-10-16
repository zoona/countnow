import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Users, Clock, Trash2, LogIn, User, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { getSessions, deleteSession, clearAllSessions } from '@/lib/supabaseStorage';
import type { CountSession } from '@/lib/supabaseStorage';
import { getCurrentUser, getCurrentProfile, signOut, type UserProfile } from '@/lib/auth';
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

export default function Home() {
  const [, setLocation] = useLocation();
  const [recentSessions, setRecentSessions] = useState<CountSession[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const sessions = await getSessions();
      setRecentSessions(sessions);
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const userProfile = await getCurrentProfile();
        setProfile(userProfile);
      }
    };
    loadData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  const soloCount = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLocation(`/room/${code}/solo`);
  };

  const multiCount = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLocation(`/room/${code}/count`);
  };

  const handleDeleteSession = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteSession(code);
    const sessions = await getSessions();
    setRecentSessions(sessions);
  };

  const handleClearAllSessions = async () => {
    await clearAllSessions();
    setRecentSessions([]);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-6">
        {/* 헤더 */}
        <div className="pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">숫자 세기</h1>
              <p className="text-sm text-muted-foreground">간단하고 직관적인 카운팅</p>
            </div>
            
            {user && profile ? (
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md cursor-pointer"
                  style={{ backgroundColor: profile.color }}
                  onClick={() => setLocation('/profile')}
                  title={profile.display_name || profile.name}
                >
                  {profile.emoji}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="로그아웃"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/login')}
                data-testid="button-login"
              >
                <LogIn className="h-4 w-4 mr-2" />
                로그인
              </Button>
            )}
          </div>
        </div>
        
        {/* 메인 버튼 영역 */}
        <div className="space-y-3 mb-12">
          <Button
            onClick={soloCount}
            className="w-full h-24 text-lg font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all"
            size="lg"
            data-testid="button-solo-count"
          >
            <div className="flex flex-col items-center gap-1">
              <Plus className="h-6 w-6" />
              <span>혼자</span>
            </div>
          </Button>

          <Button
            onClick={multiCount}
            variant="outline"
            className="w-full h-24 text-lg font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all"
            size="lg"
            data-testid="button-multi-count"
          >
            <div className="flex flex-col items-center gap-1">
              <Users className="h-6 w-6" />
              <span>같이</span>
            </div>
          </Button>
        </div>

        {recentSessions.length > 0 && (
          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">최근 기록</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                    data-testid="button-clear-all-sessions"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    전체 삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>모든 기록을 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllSessions} className="rounded-xl">삭제</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.code}
                  className="group relative p-3.5 cursor-pointer rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all"
                  onClick={() => setLocation(session.type === 'solo' ? `/room/${session.code}/solo` : `/room/${session.code}/count`)}
                  data-testid={`card-recent-session-${session.code}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-medium text-sm truncate" data-testid={`text-session-title-${session.code}`}>
                          {session.title}
                        </h3>
                        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                          session.type === 'solo' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                            : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                        }`}>
                          {session.type === 'solo' ? '혼자' : '같이'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {session.type === 'solo' ? (
                          <span className="flex items-center gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            <span className="font-medium">{session.count}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="font-medium">{session.players.length}명</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(session.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5 -mr-0.5"
                      onClick={(e) => handleDeleteSession(session.code, e)}
                      data-testid={`button-delete-session-${session.code}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
