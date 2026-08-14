# 마음 챙김 - 오늘의 명상

시간과 분위기에 맞는 자연 배경과 함께 명상하고, 습관을 기록하는 웹앱입니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드 · 배포

```bash
npm run build
npm run preview
```

Vercel에 연결하면 정적 사이트로 배포됩니다. SPA 라우팅은 `vercel.json`에서 처리합니다.

## 기능

- 시간대별 자연 배경 · 인사
- 5 / 10 / 15분 명상 타이머
- localStorage 기록 · 달력 · 연속 일수 · 7일 챌린지
- YouTube 임베드 음악

로그인·서버 DB 없음 (브라우저 localStorage만 사용).
