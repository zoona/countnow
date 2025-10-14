# CountNow (즉카) - 숫자 세기 앱

> **간단하고 재미있는 숫자 세기 웹 애플리케이션**

## 🎯 프로젝트 개요

CountNow는 혼자서 또는 여러 명이 함께 숫자를 세는 간단하고 직관적인 웹 앱입니다. 
검색 친화적인 기본 한국어 용어를 사용하여 누구나 쉽게 사용할 수 있습니다.

### 주요 특징
- ✅ **혼자 세기**: 개인 숫자 세기 기능
- ✅ **같이 세기**: 다중 참가자 동시 숫자 세기
- ✅ **영구 저장**: 커스텀 참가자 및 세션 자동 저장
- ✅ **랜덤 이모지**: 중복 없는 재미있는 이모지 시스템
- ✅ **반응형 디자인**: 모바일 우선 설계

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 5001)
PORT=5001 npm run dev

# 브라우저에서 접속
http://localhost:5001
```

### 프로덕션 빌드
```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📁 프로젝트 구조

```
CountNow/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   └── lib/            # 유틸리티 및 저장소
├── server/                 # Express 백엔드
├── shared/                 # 공유 스키마
├── .cursorrules            # 개발 규칙 (Cursor Rules)
└── package.json            # 프로젝트 설정
```

## 🔧 기술 스택

### Frontend
- **React 18.3.1** + **TypeScript**
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Radix UI** - 접근성 높은 UI 컴포넌트
- **Wouter** - 경량 라우팅

### Backend
- **Express** + **TypeScript**
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - 데이터베이스 (Neon)

### 개발 도구
- **Vite** - 빌드 도구
- **ESBuild** - 프로덕션 번들링

## 🎮 사용법

### 혼자 세기
1. 홈 화면에서 **"혼자 세기"** 클릭
2. 큰 버튼을 탭하여 숫자 증가
3. 작은 버튼으로 숫자 감소
4. 제목 편집 및 공유 가능

### 같이 세기
1. 홈 화면에서 **"같이 세기"** 클릭
2. **"함께할 사람"** 선택 또는 추가
3. 각 참가자별로 개별 숫자 세기
4. 롱프레스로 연속 증가 가능

## 🎨 핵심 컴포넌트

### PlayerButton
- 롱프레스 지원 (500ms 후 연속 증가)
- 색상별 참가자 구분
- 증가/감소 버튼 분리

### 세션 관리
- localStorage 기반 자동 저장 (2초 간격)
- 커스텀 참가자 영구 저장
- 최근 10개 세션 유지

### 데이터 모델
```typescript
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
```

## 🔄 라우팅 구조

```
/                           → Home (홈 화면)
/room/:code/solo            → SoloCount (혼자 세기)
/room/:code/count           → QuickCount (같이 세기)
/room/:code                 → SoloCount (기본)
/*                          → NotFound (404)
```

## 🎯 개발 규칙

모든 개발 규칙은 [`.cursorrules`](.cursorrules) 파일에 정의되어 있으며, Cursor에서 자동으로 적용됩니다.

### 주요 규칙
- **용어 체계**: "숫자 세기", "혼자 세기", "같이 세기"
- **UI 통일성**: 버튼 `h-16`, 보더 `rounded-3xl`, 그림자 `shadow-lg`
- **색상 시스템**: 체크 버튼 `bg-green-500`, 삭제 버튼 `bg-red-500`
- **테스트 ID**: `data-testid` 속성 필수
- **성능**: useEffect cleanup 함수 필수

## 📝 주요 변경사항

### 2025-01-13
- ✅ UI/UX 전면 개선 (버튼 통일, 색상 시스템)
- ✅ "숫자 세기" 용어 체계로 전면 변경
- ✅ 커스텀 참가자 영구 저장 기능
- ✅ 랜덤 이모지 시스템 도입
- ✅ 세션 제목 시스템 개선
- ✅ Cursor Rules 자동 적용

## 🤝 기여하기

1. [`.cursorrules`](.cursorrules) 파일의 규칙을 준수해주세요
2. 기존 패턴과 일관성을 유지해주세요
3. 새로운 기능은 검색 친화적이고 직관적으로 만들어주세요

## 📄 라이선스

MIT License

---

**CountNow - 간단하고 재미있는 숫자 세기 앱** 🎯