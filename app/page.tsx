'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/auth';

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      setLoading(false);
      if (!auth) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">환영합니다!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Ailo 애플리케이션에 오신 것을 환영합니다.
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <h2 className="text-lg font-semibold text-blue-900">사용 가능한 기능</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-blue-800">
                <li>로그인 / 회원가입</li>
                <li>로그아웃</li>
                <li>회원 탈퇴</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
