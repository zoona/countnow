-- CountNow 세션 테이블 생성
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('solo', 'multi')),
  title TEXT,
  count INTEGER DEFAULT 0,
  players JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코드로 빠르게 찾기 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);

-- 최근 세션 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions(updated_at DESC);

-- 업데이트 시 updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (익명 포함)
CREATE POLICY "Anyone can read sessions"
ON sessions FOR SELECT
USING (true);

-- 모든 사용자가 삽입 가능 (새 세션 생성)
CREATE POLICY "Anyone can insert sessions"
ON sessions FOR INSERT
WITH CHECK (true);

-- 모든 사용자가 업데이트 가능 (실시간 협업)
CREATE POLICY "Anyone can update sessions"
ON sessions FOR UPDATE
USING (true);

-- 1시간 이상 지난 세션 삭제 가능
CREATE POLICY "Anyone can delete old sessions"
ON sessions FOR DELETE
USING (updated_at < NOW() - INTERVAL '1 hour');

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

COMMENT ON TABLE sessions IS 'CountNow 세션 데이터 (혼자 세기, 같이 세기)';
COMMENT ON COLUMN sessions.code IS '6자리 공유 코드';
COMMENT ON COLUMN sessions.type IS '세션 타입: solo(혼자), multi(같이)';
COMMENT ON COLUMN sessions.count IS 'solo 세션의 숫자';
COMMENT ON COLUMN sessions.players IS 'multi 세션의 참가자 배열 (JSON)';

