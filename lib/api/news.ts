import apiClient from './client';
import { NewsComment, CreateNewsCommentRequest } from '@/lib/types/news';

export async function createNewsComment(request: CreateNewsCommentRequest): Promise<NewsComment> {
  const { data } = await apiClient.post<NewsComment>('/news/comments', request);
  return data;
}

export async function getRecentNewsComments(limit = 3): Promise<NewsComment[]> {
  const { data } = await apiClient.get<NewsComment[]>('/news/comments/recent', {
    params: { limit },
  });
  return data;
}

