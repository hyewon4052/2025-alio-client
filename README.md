# Ailo Client

Ailo 서버 API와 연동하는 Next.js 프론트엔드 애플리케이션입니다.

## 기능

- ✅ 로그인 / 회원가입
- ✅ JWT 토큰 기반 인증
- ✅ 로그아웃
- ✅ 회원 탈퇴
- ✅ 자동 토큰 관리 및 인증 인터셉터

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios

## 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 프로젝트 구조

```
Client/
├── app/              # Next.js App Router 페이지
│   ├── login/       # 로그인 페이지
│   ├── signup/      # 회원가입 페이지
│   └── page.tsx     # 메인 페이지
├── components/       # React 컴포넌트
│   └── Navbar.tsx   # 네비게이션 바
├── lib/
│   ├── api/         # API 클라이언트
│   │   ├── auth.ts  # 인증 API
│   │   └── client.ts # Axios 인스턴스
│   ├── types/       # TypeScript 타입 정의
│   │   └── auth.ts  # 인증 관련 타입
│   └── utils/       # 유틸리티 함수
│       └── auth.ts  # 인증 유틸리티
└── public/          # 정적 파일
```

## API 엔드포인트

### 인증 (Auth)

- `POST /auth/login` - 로그인
- `POST /auth/signup` - 회원가입
- `POST /auth/logout` - 로그아웃 (인증 필요)
- `DELETE /auth/quit` - 회원 탈퇴 (인증 필요)

## 주요 기능 설명

### 인증 시스템

- JWT 토큰을 localStorage에 저장하여 관리
- Axios 인터셉터를 사용하여 요청 시 자동으로 토큰 추가
- 401 에러 발생 시 자동으로 로그인 페이지로 리다이렉트

### 토큰 관리

- `setTokens()`: 토큰 저장
- `getAccessToken()`: Access Token 조회
- `getRefreshToken()`: Refresh Token 조회
- `removeTokens()`: 토큰 삭제
- `isAuthenticated()`: 인증 상태 확인

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
