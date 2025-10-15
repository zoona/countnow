-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  display_name TEXT,
  emoji TEXT DEFAULT '😊',
  color TEXT DEFAULT '#FF6B6B',
  avatar_url TEXT,
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커스텀 참가자 테이블 (클라우드 저장)
CREATE TABLE IF NOT EXISTS custom_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 친구 초대 테이블
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 세션 테이블에 소유자 및 즐겨찾기 추가
ALTER TABLE sessions 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_custom_participants_user ON custom_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_participants_usage ON custom_participants(user_id, usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_favorite ON sessions(user_id, is_favorite) WHERE is_favorite = true;

-- updated_at 자동 갱신 함수 (프로필)
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- updated_at 자동 갱신 함수 (커스텀 참가자)
CREATE TRIGGER update_custom_participants_updated_at
BEFORE UPDATE ON custom_participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 프로필 RLS 정책
CREATE POLICY "Users can read all profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 커스텀 참가자 RLS 정책
CREATE POLICY "Users can read own custom participants"
ON custom_participants FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom participants"
ON custom_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom participants"
ON custom_participants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom participants"
ON custom_participants FOR DELETE
USING (auth.uid() = user_id);

-- 초대 RLS 정책
CREATE POLICY "Users can read own referrals"
ON referrals FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can insert referrals"
ON referrals FOR INSERT
WITH CHECK (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- 세션 RLS 정책 업데이트 (소유자 개념 추가)
DROP POLICY IF EXISTS "Anyone can update sessions" ON sessions;

CREATE POLICY "Anyone can update sessions"
ON sessions FOR UPDATE
USING (user_id IS NULL OR auth.uid() = user_id OR true);

CREATE POLICY "Users can update own session favorites"
ON sessions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 초대 코드 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 프로필 생성 시 자동으로 초대 코드 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := generate_referral_code();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

COMMENT ON TABLE profiles IS '사용자 프로필 (인증 사용자)';
COMMENT ON TABLE custom_participants IS '사용자가 저장한 커스텀 참가자';
COMMENT ON TABLE referrals IS '친구 초대 추적';
COMMENT ON COLUMN profiles.referral_code IS '고유 초대 코드 (자동 생성)';
COMMENT ON COLUMN custom_participants.usage_count IS '사용 횟수 (자동 증가, 정렬용)';

