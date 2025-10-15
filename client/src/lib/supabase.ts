import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // CountNow는 익명 사용
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // 실시간 업데이트 빈도
    },
  },
});

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          code: string;
          type: 'solo' | 'multi';
          title: string | null;
          count: number | null;
          players: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'solo' | 'multi';
          title?: string | null;
          count?: number | null;
          players?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: 'solo' | 'multi';
          title?: string | null;
          count?: number | null;
          players?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

