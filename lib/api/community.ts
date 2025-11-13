import apiClient from './client';
import {
  CaseArchiveItem,
  CommunityPostCard,
  CommunityPostDetail,
  CommunityPostPayload,
  CommunityPostSummary,
} from '@/lib/types/community';

export async function createCommunityPost(payload: CommunityPostPayload) {
  const { data } = await apiClient.post<CommunityPostDetail>(
    '/community/posts',
    payload,
  );
  return data;
}

export async function getCommunityPosts(tag?: string) {
  const { data } = await apiClient.get<CommunityPostSummary[]>('/community/posts', {
    params: tag ? { tag } : undefined,
  });
  return data;
}

export async function getCommunityPost(postId: number) {
  const { data } = await apiClient.get<CommunityPostDetail>(
    `/community/posts/${postId}`,
  );
  return data;
}

export async function getCommunityCards(limit = 6) {
  const { data } = await apiClient.get<CommunityPostCard[]>('/community/posts/cards', {
    params: { limit },
  });
  return data;
}

export async function getCaseArchive() {
  const { data } = await apiClient.get<CaseArchiveItem[]>('/community/cases');
  return data;
}

