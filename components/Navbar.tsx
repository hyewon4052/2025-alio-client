'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, quitUser } from '@/lib/api/auth';
import { removeTokens, getRefreshToken, isAuthenticated } from '@/lib/utils/auth';

export default function Navbar() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout({ refreshToken });
      }
      removeTokens();
      setAuthenticated(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      removeTokens();
      setAuthenticated(false);
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleQuitUser = async () => {
    setLoading(true);
    try {
      await quitUser();
      removeTokens();
      setAuthenticated(false);
      setShowQuitModal(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Quit user error:', error);
      alert('회원 탈퇴에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Ailo
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <span>메뉴</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          로그아웃
                        </button>
                        <button
                          onClick={() => setShowQuitModal(true)}
                          disabled={loading}
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          회원 탈퇴
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 회원 탈퇴 확인 모달 */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">회원 탈퇴</h3>
            <p className="mt-2 text-sm text-gray-600">
              정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowQuitModal(false)}
                disabled={loading}
                className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleQuitUser}
                disabled={loading}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

