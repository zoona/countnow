# 인증 기능 테스트 가이드

## 🔴 필수 사전 작업 (Supabase 설정)

### 1. SQL 마이그레이션 실행

Supabase Dashboard → SQL Editor에서 실행:

```sql
-- 파일 위치: supabase/migrations/002_add_auth_and_profiles.sql
-- 전체 내용을 복사해서 실행하세요
```

또는 직접 실행:
```bash
cat supabase/migrations/002_add_auth_and_profiles.sql
```

### 2. Google OAuth 설정

**A. Google Cloud Console**
1. https://console.cloud.google.com 접속
2. 프로젝트 선택 또는 생성
3. "API 및 서비스" → "사용자 인증 정보"
4. "OAuth 2.0 클라이언트 ID" 생성
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI 추가:
     ```
     https://czdwfjmomqujckcztncl.supabase.co/auth/v1/callback
     ```
5. 클라이언트 ID와 보안 비밀번호 복사

**B. Supabase Dashboard**
1. https://supabase.com/dashboard/project/czdwfjmomqujckcztncl 접속
2. Authentication → Providers
3. Google 클릭
4. Enable 켜기
5. Client ID와 Client Secret 입력
6. Save

### 3. Site URL 설정

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://countnow.vercel.app`
- Redirect URLs 추가:
  ```
  https://countnow.vercel.app/auth/callback
  http://localhost:5001/auth/callback
  ```

---

## 🧪 로컬 테스트 방법

### 1. 개발 서버 실행

```bash
PORT=5001 npm run dev
```

브라우저: http://localhost:5001

### 2. 테스트 시나리오

#### A. 로그인 없이 사용 (기존 기능)
1. 홈 페이지 접속
2. "혼자 세기" 또는 "같이 세기" 클릭
3. 정상 작동 확인
4. ✅ 기존 기능 유지됨

#### B. 로그인 페이지 접속
1. 브라우저: http://localhost:5001/login
2. "구글로 계속하기" 버튼 확인
3. "로그인 없이 계속하기" 클릭 → 홈으로 이동
4. ✅ 로그인 페이지 UI 확인

#### C. Google 로그인 (OAuth 설정 완료 후)
1. /login 페이지
2. "구글로 계속하기" 클릭
3. Google 로그인 화면 표시
4. 로그인 완료 → /auth/callback → /onboarding
5. ✅ OAuth 흐름 확인

#### D. 온보딩 (프로필 설정)
1. 온보딩 페이지 자동 이동
2. 이름 입력: "홍길동"
3. 이모지 선택: 😊
4. 색상 선택: #FF6B6B
5. "시작하기" 클릭
6. ✅ 홈으로 이동

#### E. 프로필 확인 (Supabase)
1. Supabase Dashboard → Table Editor
2. profiles 테이블 확인
3. ✅ 사용자 데이터 저장 확인

---

## 🐛 문제 해결

### OAuth 에러
```
Error: invalid_request
```
**해결:** Redirect URI 설정 확인

### 프로필 생성 실패
```
Error: permission denied for table profiles
```
**해결:** SQL 마이그레이션 재실행 (RLS 정책)

### 빌드 에러
```
Module not found: Can't resolve '@/pages/Login'
```
**해결:** 
```bash
npm run build
```

---

## 📱 프로덕션 테스트

### 1. Vercel 환경 변수 확인

```bash
vercel env ls
```

확인 항목:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY

### 2. 배포

```bash
vercel --prod
```

### 3. 프로덕션 URL 테스트

https://countnow.vercel.app/login

---

## ✅ 현재 구현된 기능

- ✅ Google OAuth 로그인
- ✅ 프로필 생성 (이름, 이모지, 색상)
- ✅ 온보딩 플로우
- ✅ localStorage → Supabase 마이그레이션 준비
- ✅ 익명 사용 계속 가능

## 🚧 아직 구현 안 된 기능

- ❌ Home 페이지에 로그인 버튼
- ❌ 내 프로필 자동 표시 (같이 세기)
- ❌ 커스텀 참가자 클라우드 동기화
- ❌ 세션 소유자 연결
- ❌ 즐겨찾기
- ❌ 내 기록 페이지
- ❌ 친구 초대

---

## 📝 다음 단계

1. SQL 마이그레이션 실행
2. Google OAuth 설정
3. 로컬 테스트
4. 나머지 기능 구현 계속


