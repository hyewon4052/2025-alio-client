'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCommunityCards, getCommunityPost } from '@/lib/api/community';
import { CommunityPostCard, CommunityPostDetail } from '@/lib/types/community';

const CASE_TYPE_LABEL: Record<string, string> = {
  SUCCESS: '성공 사례',
  RISK: '위험/피해 사례',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function splitParagraphs(content: string) {
  return content
    .split(/\n{2,}|\r{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export default function CommunityDetailPage() {
  const params = useParams<{ postId: string }>();
  const router = useRouter();
  const postId = useMemo(() => Number(params?.postId), [params]);
  const [post, setPost] = useState<CommunityPostDetail>();
  const [related, setRelated] = useState<CommunityPostCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!postId || Number.isNaN(postId)) {
        setError('잘못된 게시글 ID입니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [detail, cards] = await Promise.all([
          getCommunityPost(postId),
          getCommunityCards(6),
        ]);
        setPost(detail);
        setRelated(cards.filter((card) => card.id !== postId).slice(0, 4));
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen text-slate-100">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-16">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-400 transition hover:text-fuchsia-300"
          >
            ← 뒤로가기
          </button>
          <div className="glass-card mt-8 rounded-3xl px-6 py-16 text-center text-sm text-slate-300">
            {error ?? '게시글 정보를 찾을 수 없습니다.'}
            <div className="mt-6">
              <Link
                href="/community"
                className="rounded-full bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400"
              >
                커뮤니티로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = splitParagraphs(post.content);

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-16">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-400 transition hover:text-fuchsia-300"
          >
            ← 목록으로 돌아가기
          </button>
          <Link
            href="/community/new"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            나도 후기 쓰기
          </Link>
        </div>

        <article className="glass-card mt-8 rounded-3xl px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-fuchsia-500/20 px-4 py-1 text-fuchsia-200">
                {CASE_TYPE_LABEL[post.caseType] ?? post.caseType}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                평점 {post.rating}/5
              </span>
            </div>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-300">작성자 {post.author}</p>

          <section className="mt-8 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-6 py-5">
            <div className="flex items-center justify-between text-xs text-fuchsia-200">
              <span>AI 요약</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-fuchsia-100">리스크 인사이트</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-fuchsia-100">
              {post.summary || '요약 정보가 아직 준비되지 않았습니다.'}
            </p>
          </section>

          <section className="mt-10 space-y-5 text-sm leading-7 text-slate-100">
            {paragraphs.length === 0
              ? (
                <p className="text-slate-300">
                  작성된 본문이 없습니다. 상세 내용은 작성자에게 문의해주세요.
                </p>
                )
              : (
                paragraphs.map((paragraph, index) => (
                  <p key={index} className="rounded-2xl bg-white/4 px-5 py-3 text-slate-200">
                    {paragraph}
                  </p>
                ))
              )}
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/community?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">비슷한 사례 보기</h2>
              <Link href="/community" className="text-xs text-slate-400 transition hover:text-fuchsia-300">
                전체보기 →
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/community/${item.id}`}
                  className="glass-card-light group flex h-full flex-col justify-between rounded-3xl px-5 py-6 transition hover:bg-white/15"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{CASE_TYPE_LABEL[item.caseType] ?? item.caseType}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-200">
                      {item.summary || '요약 준비 중입니다. 상세 페이지에서 내용을 확인하세요.'}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition group-hover:bg-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
