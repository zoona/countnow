# CountNow 배포 가이드

이 문서는 CountNow 앱을 다양한 플랫폼에 배포하는 방법을 설명합니다.

## 🚀 배포 전 준비사항

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://localhost:5432/countnow
```

> **참고**: 현재 CountNow는 클라이언트 측 localStorage를 사용하므로 실제 데이터베이스는 사용하지 않습니다. DATABASE_URL은 빌드 시스템 호환성을 위한 더미 값입니다.

### 2. 빌드 테스트

배포 전에 로컬에서 빌드를 테스트하세요:

```bash
npm run build
npm start
```

브라우저에서 `http://localhost:5000`으로 접속하여 정상 작동을 확인하세요.

---

## 📦 배포 플랫폼별 가이드

### 1. Vercel (추천 🌟)

**장점**: 무료, 자동 HTTPS, 글로벌 CDN, GitHub 연동 자동 배포

#### 배포 방법

**A. Vercel CLI 사용**

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

**B. Vercel 대시보드 사용**

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 환경 변수 설정:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `postgresql://localhost:5432/countnow`
5. Deploy 클릭

**설정 파일**: `vercel.json` (이미 포함됨)

---

### 2. Render

**장점**: 무료 티어, 간단한 설정, 자동 배포

#### 배포 방법

1. [Render](https://render.com) 접속 및 로그인
2. "New +" → "Web Service" 클릭
3. GitHub 저장소 연결
4. 설정:
   - **Name**: `countnow`
   - **Region**: `Singapore` (한국과 가까움)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 환경 변수 추가:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: `postgresql://localhost:5432/countnow`
6. "Create Web Service" 클릭

**설정 파일**: `render.yaml` (이미 포함됨)

---

### 3. Railway

**장점**: 간단한 배포, 무료 크레딧 제공

#### 배포 방법

1. [Railway](https://railway.app) 접속 및 로그인
2. "New Project" → "Deploy from GitHub repo" 클릭
3. 저장소 선택
4. 환경 변수 추가:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: `postgresql://localhost:5432/countnow`
5. Deploy

**설정 파일**: `railway.json` (이미 포함됨)

---

### 4. Fly.io

**장점**: 글로벌 배포, 무료 티어

#### 배포 방법

```bash
# Fly CLI 설치 (macOS)
brew install flyctl

# 로그인
fly auth login

# 앱 초기화
fly launch

# 환경 변수 설정
fly secrets set NODE_ENV=production
fly secrets set DATABASE_URL=postgresql://localhost:5432/countnow

# 배포
fly deploy
```

---

### 5. Docker 컨테이너

Docker를 지원하는 모든 플랫폼에서 사용 가능합니다.

#### 로컬 테스트

```bash
# Docker 이미지 빌드
docker build -t countnow .

# 컨테이너 실행
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://localhost:5432/countnow \
  countnow
```

#### Docker Hub 배포

```bash
# 이미지 태그
docker tag countnow yourusername/countnow:latest

# Docker Hub에 푸시
docker push yourusername/countnow:latest
```

---

### 6. Heroku

**주의**: Heroku는 2022년 11월부터 무료 티어를 제공하지 않습니다.

#### 배포 방법

```bash
# Heroku CLI 설치 및 로그인
brew tap heroku/brew && brew install heroku
heroku login

# 앱 생성
heroku create countnow-app

# 환경 변수 설정
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://localhost:5432/countnow

# 배포
git push heroku main
```

**설정 파일**: `Procfile` (이미 포함됨)

---

## 🔧 배포 후 확인사항

### 1. 기능 테스트

- [ ] 홈 페이지 로딩
- [ ] 혼자 세기 기능
- [ ] 같이 세기 기능
- [ ] localStorage 저장/불러오기
- [ ] 커스텀 참가자 추가
- [ ] 공유 기능
- [ ] 반응형 디자인 (모바일/데스크톱)

### 2. 성능 확인

- [ ] 페이지 로딩 속도
- [ ] 버튼 응답 속도
- [ ] 롱프레스 기능

### 3. SEO 확인

- [ ] 메타 태그 확인
- [ ] Open Graph 이미지
- [ ] 사이트맵 (필요시)

---

## 🌐 커스텀 도메인 설정

### Vercel

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 입력 및 DNS 레코드 추가

### Render

1. Render 대시보드 → 서비스 → Settings → Custom Domain
2. CNAME 레코드 추가

### Railway

1. Railway 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 입력 및 DNS 설정

---

## 📊 모니터링 및 로깅

### 추천 도구

- **Sentry**: 에러 추적
- **Google Analytics**: 사용자 분석
- **Vercel Analytics**: 성능 모니터링 (Vercel 사용 시)

---

## 🔄 CI/CD 설정

### GitHub Actions 예시

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 트러블슈팅

### 빌드 실패

```bash
# 캐시 삭제 후 재시도
rm -rf node_modules dist
npm install
npm run build
```

### 포트 충돌

환경 변수 `PORT`가 올바르게 설정되었는지 확인하세요.

### 정적 파일 404 에러

빌드 출력 디렉토리가 `dist/public`인지 확인하세요.

---

## 📝 체크리스트

배포 전 다음 사항을 확인하세요:

- [ ] `.env` 파일 설정
- [ ] 로컬 빌드 테스트 완료
- [ ] 프로덕션 테스트 완료
- [ ] 환경 변수 설정 완료
- [ ] 도메인 설정 (선택사항)
- [ ] HTTPS 활성화 확인
- [ ] 모니터링 도구 설정 (선택사항)

---

## 🆘 지원

문제가 발생하면:
1. 이 가이드의 트러블슈팅 섹션 확인
2. GitHub Issues 검색
3. 새로운 Issue 생성

---

**CountNow를 성공적으로 배포하세요! 🎉**


