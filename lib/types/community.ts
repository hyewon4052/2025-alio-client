export type CommunityCaseType = 'SUCCESS' | 'RISK';

export interface CommunityPostSummary {
  id: number;
  title: string;
  author: string;
  rating: number;
  caseType: CommunityCaseType;
  summary: string;
  isAnonymous: boolean;
  viewCount: number;
  createdAt: string;
  tags: string[];
  country?: string;
}

export interface CommunityPostCard {
  id: number;
  title: string;
  summary: string;
  author: string;
  caseType: CommunityCaseType;
  createdAt: string;
  tags: string[];
}

export interface CommunityPostDetail {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  rating: number;
  caseType: CommunityCaseType;
  isAnonymous: boolean;
  viewCount: number;
  createdAt: string;
  tags: string[];
  country?: string;
}

export interface CaseArchiveItem {
  caseType: CommunityCaseType;
  summary: string;
  highlightTags: string[];
  relatedPostIds: number[];
}

export interface CommunityPostPayload {
  title: string;
  content: string;
  rating: number;
  tags: string[];
  caseType: CommunityCaseType;
  isAnonymous?: boolean;
  country?: string;
}

