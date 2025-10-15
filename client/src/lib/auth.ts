import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  display_name: string | null;
  emoji: string;
  color: string;
  avatar_url: string | null;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomParticipant {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// 현재 로그인한 사용자 가져오기
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 현재 사용자의 프로필 가져오기
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Failed to get profile:', error);
    return null;
  }

  return data as UserProfile;
}

// 프로필 생성
export async function createProfile(profile: {
  name: string;
  display_name?: string;
  emoji?: string;
  color?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email!,
      name: profile.name,
      display_name: profile.display_name || profile.name,
      emoji: profile.emoji || '😊',
      color: profile.color || '#FF6B6B',
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create profile:', error);
    throw error;
  }

  return data as UserProfile;
}

// 프로필 업데이트
export async function updateProfile(updates: Partial<UserProfile>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }

  return data as UserProfile;
}

// 구글 로그인
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }

  return data;
}

// 애플 로그인
export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Apple sign in error:', error);
    throw error;
  }

  return data;
}

// 카카오 로그인 (커스텀 OAuth 필요)
export async function signInWithKakao() {
  // Supabase에서 카카오 OAuth 설정 필요
  // 현재는 플레이스홀더
  throw new Error('Kakao login not configured yet');
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// 인증 상태 변경 리스너
export function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}

// 프로필 존재 여부 확인
export async function hasProfile(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  return !!data;
}

