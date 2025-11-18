export interface NewsComment {
  id: number;
  content: string;
  createdAt: string;
}

export interface CreateNewsCommentRequest {
  content: string;
}

