import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { hasProfile } from '@/lib/auth';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 프로필 존재 여부 확인
        const profileExists = await hasProfile();
        
        if (profileExists) {
          // 프로필 있으면 홈으로
          setLocation('/');
        } else {
          // 프로필 없으면 온보딩으로
          setLocation('/onboarding');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setLocation('/');
      }
    };

    // URL 처리를 위해 약간의 지연
    setTimeout(handleCallback, 500);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
}

