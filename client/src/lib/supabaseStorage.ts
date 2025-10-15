import { supabase } from './supabase';

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

interface SoloSession {
  code: string;
  type: 'solo';
  count: number;
  timestamp: number;
  startedAt?: number;
  title?: string;
}

interface MultiSession {
  code: string;
  type: 'multi';
  players: Player[];
  timestamp: number;
  startedAt?: number;
  title?: string;
}

export type CountSession = SoloSession | MultiSession;

// Session 저장
export async function saveSession(session: CountSession) {
  try {
    const dbSession = {
      code: session.code,
      type: session.type,
      title: session.title || null,
      count: session.type === 'solo' ? session.count : null,
      players: session.type === 'multi' ? session.players : null,
    };

    const { data, error } = await supabase
      .from('sessions')
      .upsert(dbSession, {
        onConflict: 'code',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to save session:', error);
    return null;
  }
}

// Session 조회
export async function getSession(code: string): Promise<CountSession | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !data) {
      return null;
    }

    const session: CountSession = {
      code: data.code,
      type: data.type as 'solo' | 'multi',
      timestamp: new Date(data.updated_at).getTime(),
      startedAt: new Date(data.created_at).getTime(),
      title: data.title || undefined,
      ...(data.type === 'solo'
        ? { count: data.count || 0 }
        : { players: data.players || [] }
      ),
    } as CountSession;

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

// 최근 세션 조회 (로컬 + 서버 혼합)
export async function getSessions(): Promise<CountSession[]> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      code: item.code,
      type: item.type as 'solo' | 'multi',
      timestamp: new Date(item.updated_at).getTime(),
      startedAt: new Date(item.created_at).getTime(),
      title: item.title || undefined,
      ...(item.type === 'solo'
        ? { count: item.count || 0 }
        : { players: item.players || [] }
      ),
    })) as CountSession[];
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return [];
  }
}

// Session 삭제
export async function deleteSession(code: string) {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('code', code);

    if (error) {
      console.error('Failed to delete session:', error);
    }
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

// 모든 세션 삭제
export async function clearAllSessions() {
  try {
    // 최근 1시간 이내 세션만 삭제 (RLS 정책 때문에 오래된 것만 가능)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { error } = await supabase
      .from('sessions')
      .delete()
      .lt('updated_at', oneHourAgo);

    if (error) {
      console.error('Failed to clear sessions:', error);
    }
  } catch (error) {
    console.error('Failed to clear sessions:', error);
  }
}

// 실시간 구독
export function subscribeToSession(
  code: string,
  callback: (session: CountSession) => void
) {
  const channel = supabase
    .channel(`session:${code}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `code=eq.${code}`,
      },
      (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const data = payload.new as any;
          const session: CountSession = {
            code: data.code,
            type: data.type as 'solo' | 'multi',
            timestamp: new Date(data.updated_at).getTime(),
            startedAt: new Date(data.created_at).getTime(),
            title: data.title || undefined,
            ...(data.type === 'solo'
              ? { count: data.count || 0 }
              : { players: data.players || [] }
            ),
          } as CountSession;
          callback(session);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Custom participants storage (로컬 저장소 유지)
const CUSTOM_PARTICIPANTS_KEY = 'countnow_custom_participants';

interface PresetLabel {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export function saveCustomParticipants(participants: PresetLabel[]) {
  try {
    localStorage.setItem(CUSTOM_PARTICIPANTS_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error('Failed to save custom participants:', error);
  }
}

export function getCustomParticipants(): PresetLabel[] {
  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get custom participants:', error);
    return [];
  }
}

