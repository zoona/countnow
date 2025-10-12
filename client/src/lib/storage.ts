interface SoloSession {
  code: string;
  type: 'solo';
  count: number;
  timestamp: number;
  title?: string;
}

interface MultiSession {
  code: string;
  type: 'multi';
  players: {
    id: string;
    name: string;
    emoji: string;
    color: string;
    count: number;
  }[];
  timestamp: number;
  title?: string;
}

export type CountSession = SoloSession | MultiSession;

const STORAGE_KEY = 'countnow_sessions';
const MAX_SESSIONS = 10;

export function saveSession(session: CountSession) {
  try {
    const sessions = getSessions();
    const existingIndex = sessions.findIndex(s => s.code === session.code);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function getSessions(): CountSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return [];
  }
}

export function getSession(code: string): CountSession | null {
  try {
    const sessions = getSessions();
    return sessions.find(s => s.code === code) || null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export function deleteSession(code: string) {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.code !== code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}
