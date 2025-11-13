import apiClient from './client';
import { NewsComment, CreateNewsCommentRequest } from '@/lib/types/news';

export async function createNewsComment(request: CreateNewsCommentRequest): Promise<NewsComment> {
  // 서버 API에 따라 엔드포인트가 다를 수 있습니다
  // 405 에러가 발생하면 다른 경로를 시도해볼 수 있습니다
  try {
    const { data } = await apiClient.post<NewsComment>('/news/comments', request);
    return data;
  } catch (error: any) {
    // 405 에러인 경우 다른 엔드포인트 시도
    if (error?.response?.status === 405) {
      try {
        const { data } = await apiClient.post<NewsComment>('/news/comment', request);
        return data;
      } catch (retryError) {
        // 두 번째 시도도 실패하면 원래 에러를 throw
        throw error;
      }
    }
    throw error;
  }
}

export async function getRecentNewsComments(limit = 3): Promise<NewsComment[]> {
  const { data } = await apiClient.get<NewsComment[]>('/news/comments/recent', {
    params: { limit },
  });
  return data;
}

