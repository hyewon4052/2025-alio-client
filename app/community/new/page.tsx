'use client';

import { FormEvent, KeyboardEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCommunityPost } from '@/lib/api/community';
import { CommunityCaseType } from '@/lib/types/community';

const CASE_OPTIONS: { value: CommunityCaseType; label: string; description: string }[] = [
  { value: 'SUCCESS', label: '성공 사례', description: '긍정적인 경험과 추천 포인트 중심' },
  { value: 'RISK', label: '위험/피해 사례', description: '사기, 비자 문제, 급여 미지급 등 경고' },
];

export default function CommunityCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(3);
  const [caseType, setCaseType] = useState<CommunityCaseType>('SUCCESS');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const tagPlaceholder = useMemo(() => {
    if (caseType === 'RISK') {
      return '예: 비자 문제, 급여 미지급, 문화 충격';
    }
    return '예: 빠른 온보딩, 현지 지원, 추천 포인트';
  }, [caseType]);

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== ',') {
      return;
    }

    event.preventDefault();
    const value = tagInput.trim().toLowerCase();
    if (!value || tags.includes(value)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim() || tags.length === 0) {
      setError('필수 항목(제목, 글, 키워드)을 모두 입력해주세요.');
      return;
    }

    try {
      setError(undefined);
      setLoading(true);
      const response = await createCommunityPost({
        title: title.trim(),
        content: content.trim(),
        rating,
        caseType,
        tags,
      });
      router.replace(`/community/${response.id}`);
    } catch (err) {
      console.error(err);
      setError('후기를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-16">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 transition hover:text-fuchsia-300"
        >
          ← 뒤로가기
        </button>

        <form
          onSubmit={handleSubmit}
          className="glass-card mt-8 space-y-10 rounded-3xl px-8 py-10"
        >
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Report Case</p>
            <h1 className="text-3xl font-bold text-white">커뮤니티 경험 공유</h1>
            <p className="text-sm leading-relaxed text-slate-300">
              익명 또는 실명을 선택해 실제 경험을 기록해 주세요. 작성된 내용은 AI 요약 및 케이스 아카이브에 반영되어
              다른 사용자에게 중요한 리스크 시그널을 제공합니다.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                익명 여부 선택 <span className="text-fuchsia-300">*</span>
              </label>
              <div className="flex gap-3 rounded-full bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className={`flex-1 rounded-full px-4 py-3 text-sm transition ${
                    isAnonymous ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  익명
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className={`flex-1 rounded-full px-4 py-3 text-sm transition ${
                    !isAnonymous ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  실명 공개
                </button>
              </div>
              <p className="text-xs text-slate-400">
                익명 선택 시, 닉네임이 공개되지 않으며 기본 아바타가 표시됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                총평 (1~5점) <span className="text-fuchsia-300">*</span>
              </label>
              <div className="flex gap-3 rounded-2xl bg-white/5 p-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm transition ${
                      rating === value ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {value}점
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">후기 전반에 대한 체감 만족도를 선택해주세요.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-200">
              케이스 유형 <span className="text-fuchsia-300">*</span>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              {CASE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCaseType(option.value)}
                  className={`rounded-2xl border px-5 py-4 text-left transition ${
                    caseType === option.value
                      ? 'border-fuchsia-400 bg-fuchsia-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs text-slate-300">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-200">
              제목 작성 <span className="text-fuchsia-300">*</span>
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="주요 AI 기능 설명을 해주세요. 해당 내용은 프롬프트로 이용됩니다."
              maxLength={120}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400 focus:bg-white/10"
            />
            <p className="text-right text-xs text-slate-400">{title.length} / 120자</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-200">
              글 작성 <span className="text-fuchsia-300">*</span>
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="주요 AI 기능 설명을 해주세요. 해당 내용은 프롬프트로 이용됩니다."
              rows={12}
              maxLength={5000}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-white outline-none transition focus:border-fuchsia-400 focus:bg-white/10"
            />
            <p className="text-right text-xs text-slate-400">{content.length} / 5000자</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200">
              주요 키워드 <span className="text-fuchsia-300">*</span>
            </label>
            <p className="text-xs text-slate-400">Enter 키 또는 , 로 키워드를 추가하세요. 최대 10개까지 입력 가능합니다.</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-slate-100"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-300 transition hover:bg-white/20"
                  >
                    삭제
                  </button>
                </span>
              ))}
              <label className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/20 px-4 py-2 text-xs text-fuchsia-200">
                <span className="rounded-full bg-fuchsia-500 px-2 py-1 text-[10px] font-semibold text-white">+</span>
                키워드 추가
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tagPlaceholder}
                  className="hidden"
                />
              </label>
            </div>
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tagPlaceholder}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400 focus:bg-white/10"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-500/20 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/community')}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:bg-fuchsia-700/40"
            >
              {loading ? '저장 중...' : '완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

