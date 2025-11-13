'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, quitUser } from '@/lib/api/auth';
import { removeTokens, getRefreshToken, isAuthenticated } from '@/lib/utils/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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

  const navLinks = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: '커뮤니티', href: '/community' },
      { label: '뉴스', href: '/news' },
    ],
    [],
  );

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <div className="glass-card-light flex items-center justify-between rounded-full px-6 py-3">
            <Link href="/" className="text-xl font-semibold text-fuchsia-400 transition hover:text-fuchsia-300">
              ailo
            </Link>
            <div className="flex flex-1 items-center justify-center space-x-2 text-sm font-medium text-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive(link.href)
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500/80 text-white shadow-lg transition hover:bg-fuchsia-400"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-48 rounded-xl bg-slate-900/95 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                      <div className="space-y-1">
                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed"
                        >
                          로그아웃
                        </button>
                        <button
                          onClick={() => setShowQuitModal(true)}
                          disabled={loading}
                          className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm text-rose-300 transition hover:bg-white/10 disabled:cursor-not-allowed"
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
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-fuchsia-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-fuchsia-400"
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
          <div className="glass-card w-full max-w-md rounded-2xl p-6 text-slate-100">
            <h3 className="text-lg font-semibold">회원 탈퇴</h3>
            <p className="mt-2 text-sm text-slate-300">
              정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowQuitModal(false)}
                disabled={loading}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleQuitUser}
                disabled={loading}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed"
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

