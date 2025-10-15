import { supabase } from './supabase';
import { getCurrentUser } from './auth';

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

// 내 커스텀 참가자 목록 가져오기
export async function getCustomParticipants(): Promise<CustomParticipant[]> {
  const user = await getCurrentUser();
  if (!user) {
    // 로그인 안 한 경우 localStorage 사용 (기존 방식)
    return getCustomParticipantsFromLocalStorage();
  }

  const { data, error } = await supabase
    .from('custom_participants')
    .select('*')
    .eq('user_id', user.id)
    .order('usage_count', { ascending: false });

  if (error) {
    console.error('Failed to get custom participants:', error);
    return [];
  }

  return data as CustomParticipant[];
}

// 커스텀 참가자 추가
export async function addCustomParticipant(participant: {
  name: string;
  emoji: string;
  color: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    // 로그인 안 한 경우 localStorage 사용
    return addCustomParticipantToLocalStorage(participant);
  }

  const { data, error} = await supabase
    .from('custom_participants')
    .insert({
      user_id: user.id,
      name: participant.name,
      emoji: participant.emoji,
      color: participant.color,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to add custom participant:', error);
    throw error;
  }

  return data as CustomParticipant;
}

// 커스텀 참가자 수정
export async function updateCustomParticipant(
  id: string,
  updates: Partial<CustomParticipant>
) {
  const user = await getCurrentUser();
  if (!user) {
    // 로그인 안 한 경우 localStorage 사용
    return updateCustomParticipantInLocalStorage(id, updates);
  }

  const { data, error } = await supabase
    .from('custom_participants')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update custom participant:', error);
    throw error;
  }

  return data as CustomParticipant;
}

// 커스텀 참가자 삭제
export async function deleteCustomParticipant(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    // 로그인 안 한 경우 localStorage 사용
    return deleteCustomParticipantFromLocalStorage(id);
  }

  const { error } = await supabase
    .from('custom_participants')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to delete custom participant:', error);
    throw error;
  }
}

// 사용 횟수 증가
export async function incrementUsageCount(id: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase.rpc('increment_usage', {
    participant_id: id,
  });

  if (error) {
    // RPC 없으면 수동으로 증가
    const { data: participant } = await supabase
      .from('custom_participants')
      .select('usage_count')
      .eq('id', id)
      .single();

    if (participant) {
      await supabase
        .from('custom_participants')
        .update({ usage_count: participant.usage_count + 1 })
        .eq('id', id);
    }
  }
}

// localStorage fallback (로그인 안 한 사용자)
const CUSTOM_PARTICIPANTS_KEY = 'countnow_custom_participants';

interface LocalCustomParticipant {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

function getCustomParticipantsFromLocalStorage(): CustomParticipant[] {
  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    if (!data) return [];

    const locals: LocalCustomParticipant[] = JSON.parse(data);
    return locals.map(p => ({
      ...p,
      user_id: 'local',
      is_favorite: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return [];
  }
}

function addCustomParticipantToLocalStorage(participant: {
  name: string;
  emoji: string;
  color: string;
}) {
  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    const participants: LocalCustomParticipant[] = data ? JSON.parse(data) : [];
    
    const newParticipant: LocalCustomParticipant = {
      id: Math.random().toString(36).substring(2, 11),
      name: participant.name,
      emoji: participant.emoji,
      color: participant.color,
    };

    participants.push(newParticipant);
    localStorage.setItem(CUSTOM_PARTICIPANTS_KEY, JSON.stringify(participants));

    return {
      ...newParticipant,
      user_id: 'local',
      is_favorite: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to add to localStorage:', error);
    throw error;
  }
}

function updateCustomParticipantInLocalStorage(
  id: string,
  updates: Partial<CustomParticipant>
) {
  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    if (!data) return null;

    const participants: LocalCustomParticipant[] = JSON.parse(data);
    const index = participants.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    participants[index] = { ...participants[index], ...updates };
    localStorage.setItem(CUSTOM_PARTICIPANTS_KEY, JSON.stringify(participants));

    return {
      ...participants[index],
      user_id: 'local',
      is_favorite: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to update localStorage:', error);
    return null;
  }
}

function deleteCustomParticipantFromLocalStorage(id: string) {
  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    if (!data) return;

    const participants: LocalCustomParticipant[] = JSON.parse(data);
    const filtered = participants.filter(p => p.id !== id);
    localStorage.setItem(CUSTOM_PARTICIPANTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete from localStorage:', error);
  }
}

// localStorage 데이터를 클라우드로 마이그레이션
export async function migrateLocalParticipantsToCloud() {
  const user = await getCurrentUser();
  if (!user) return;

  try {
    const data = localStorage.getItem(CUSTOM_PARTICIPANTS_KEY);
    if (!data) return;

    const locals: LocalCustomParticipant[] = JSON.parse(data);
    if (locals.length === 0) return;

    // 클라우드에 업로드
    const { error } = await supabase
      .from('custom_participants')
      .insert(
        locals.map(p => ({
          user_id: user.id,
          name: p.name,
          emoji: p.emoji,
          color: p.color,
        }))
      );

    if (error) {
      console.error('Failed to migrate participants:', error);
      return;
    }

    // localStorage 정리
    localStorage.removeItem(CUSTOM_PARTICIPANTS_KEY);
    console.log('Successfully migrated custom participants to cloud');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

