'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getCaseArchive,
  getCommunityCards,
  getCommunityPosts,
} from '@/lib/api/community';
import {
  CaseArchiveItem,
  CommunityPostCard,
  CommunityPostSummary,
} from '@/lib/types/community';

const CASE_TYPE_LABEL: Record<string, string> = {
  SUCCESS: '성공 사례',
  RISK: '위험 사례',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPostSummary[]>([]);
  const [cards, setCards] = useState<CommunityPostCard[]>([]);
  const [archives, setArchives] = useState<CaseArchiveItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>();
  const [sortOption, setSortOption] = useState<'popular' | 'recent'>('popular');
  const [country, setCountry] = useState('전체');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoadingInitial(true);
        const [cardData, archiveData] = await Promise.all([
          getCommunityCards(6),
          getCaseArchive(),
        ]);
        setCards(cardData);
        setArchives(archiveData);
      } catch (error) {
        console.error('Failed to load community summary', error);
      } finally {
        setLoadingInitial(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const list = await getCommunityPosts(selectedTag);
        setPosts(list);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [selectedTag]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (sortOption === 'recent') {
      return [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return posts;
  }, [posts, sortOption]);

  const popularTags = useMemo(() => {
    const counter = new Map<string, number>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counter.set(tag, (counter.get(tag) ?? 0) + 1);
      });
    });
    return [...counter.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [posts]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-slate-100">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Community Hub</p>
            <h1 className="mt-3 text-4xl font-bold text-white">커뮤니티 케이스 리포트</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              실제 경험을 기반으로 해외 취업의 리스크와 성공 사례를 실시간으로 모니터링하세요.
              케이스 아카이브는 AI 요약으로 핵심 경고 문장을 추려드립니다.
            </p>
          </div>
          <Link
            href="/community/new"
            className="inline-flex items-center justify-center rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-fuchsia-400"
          >
            후기 작성하기
          </Link>
        </header>

        <section className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="glass-card-light flex w-full flex-col gap-3 rounded-2xl px-5 py-4 text-xs md:flex-row md:items-center md:justify-between md:text-sm">
            <div className="flex items-center gap-3">
              <span className="text-slate-300">정렬</span>
              <div className="flex gap-2 rounded-full bg-white/5 p-1">
                <button
                  onClick={() => setSortOption('popular')}
                  className={`rounded-full px-4 py-2 transition ${
                    sortOption === 'popular' ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  인기순
                </button>
                <button
                  onClick={() => setSortOption('recent')}
                  className={`rounded-full px-4 py-2 transition ${
                    sortOption === 'recent' ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  최신순
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">국가 선택</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 outline-none transition hover:bg-white/10"
              >
                {['전체', '캄보디아', '일본', '싱가포르', '미국', '영국'].map((option) => (
                  <option key={option} value={option} className="bg-slate-900 text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">핵심 키워드</span>
              <div className="flex flex-wrap gap-2">
                {popularTags.length === 0 ? (
                  <span className="text-xs text-slate-500">데이터 수집 중...</span>
                ) : (
                  popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        selectedTag === tag
                          ? 'bg-fuchsia-500 text-white'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">케이스 아카이브</h2>
            <span className="text-xs text-slate-400">5분 단위 업데이트 · AI 요약 및 리스크 분류</span>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {loadingInitial && archives.length === 0 ? (
              <div className="glass-card-light flex h-48 items-center justify-center rounded-2xl text-sm text-slate-400">
                아카이브를 불러오는 중입니다...
              </div>
            ) : archives.length === 0 ? (
              <div className="glass-card-light flex h-48 items-center justify-center rounded-2xl text-sm text-slate-400">
                아직 집계된 사례가 없습니다. 첫 후기를 작성해보세요.
              </div>
            ) : (
              archives.map((archive) => (
                <div key={archive.caseType} className="glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-fuchsia-300">
                      {CASE_TYPE_LABEL[archive.caseType] ?? archive.caseType}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-400">
                      5분 전 업데이트
                    </span>
                  </div>
                  <p className="mt-4 min-h-[88px] text-sm text-slate-200">
                    {archive.summary || '아직 요약이 생성되지 않았습니다. 최신 후기를 기다리는 중입니다.'}
                  </p>
                  <div className="mt-5">
                    <p className="text-xs font-semibold text-slate-400">주요 태그</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {archive.highlightTags.length === 0 ? (
                        <span className="text-xs text-slate-500">태그가 아직 없습니다.</span>
                      ) : (
                        archive.highlightTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20"
                          >
                            #{tag}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="text-xs font-semibold text-slate-400">관련 사례</p>
                    <div className="mt-3 space-y-2">
                      {archive.relatedPostIds.slice(0, 3).map((id) => (
                        <Link
                          key={id}
                          href={`/community/${id}`}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                        >
                          <span>연관 후기 #{id}</span>
                          <span className="text-[11px] text-slate-400">바로가기 →</span>
                        </Link>
                      ))}
                      {archive.relatedPostIds.length === 0 && (
                        <span className="text-xs text-slate-500">연관 후기가 아직 없습니다.</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">실시간 요약 카드</h2>
            <span className="text-xs text-slate-400">최근 6개의 후기를 카드형으로 요약합니다.</span>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.length === 0 ? (
              <div className="glass-card-light flex h-44 items-center justify-center rounded-2xl text-sm text-slate-400 md:col-span-2 lg:col-span-3">
                아직 요약 카드가 없습니다.
              </div>
            ) : (
              cards.map((card) => (
                <Link
                  key={card.id}
                  href={`/community/${card.id}`}
                  className="glass-card group flex h-full flex-col justify-between rounded-3xl p-5 transition hover:bg-white/15"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{CASE_TYPE_LABEL[card.caseType] ?? card.caseType}</span>
                      <span>{formatDate(card.createdAt)}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 line-clamp-4 text-sm text-slate-200">
                      {card.summary || '요약 준비 중입니다. 상세 페이지에서 내용을 확인하세요.'}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition group-hover:bg-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">리스트형 후기</h2>
              <p className="text-xs text-slate-400">디씨인사이드 같은 테이블 뷰로 모든 후기를 관리합니다.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedTag(undefined)}
                className={`rounded-full px-3 py-1 transition ${
                  !selectedTag ? 'bg-fuchsia-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                전체 보기
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full px-3 py-1 transition ${
                    selectedTag === tag
                      ? 'bg-fuchsia-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card mt-6 overflow-hidden rounded-3xl">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  <th className="px-6 py-4">번호</th>
                  <th className="px-6 py-4">제목</th>
                  <th className="px-6 py-4">작성일</th>
                  <th className="px-6 py-4">작성자</th>
                  <th className="px-6 py-4">평점</th>
                  <th className="px-6 py-4">유형</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingPosts ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      후기를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      아직 등록된 후기가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="transition hover:bg-white/6"
                    >
                      <td className="px-6 py-4 text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/community/${post.id}`}
                          className="text-sm font-semibold text-white transition hover:text-fuchsia-300"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          {post.summary || '요약 정보 없음'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(tag)}
                              className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-200 transition hover:bg-white/20"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 text-xs text-slate-300">{post.author}</td>
                      <td className="px-6 py-4 text-xs text-fuchsia-300">{post.rating ?? '-'}</td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {CASE_TYPE_LABEL[post.caseType] ?? post.caseType}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

