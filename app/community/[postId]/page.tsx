"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import Flex from "@/components/common/Flex";
import ZoomWrapper from "@/components/common/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";
import { getCommunityCards, getCommunityPost } from "@/lib/api/community";
import { CommunityPostCard, CommunityPostDetail } from "@/lib/types/community";

const RISK_KEYWORDS = [
  "즉시 합격",
  "숙소 제공",
  "교육비 환급",
  "고수익",
  "텔레그램 문의",
  "비자 정보 없음",
  "치안 안 좋음",
  "물가 비쌈",
];

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function splitParagraphs(content: string) {
  return content
    .split(/\n{2,}|\r{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export default function CommunityDetailPage() {
  const { width, height } = useWindowSize();
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
        setError("잘못된 게시글 ID입니다.");
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
        setRelated(cards.filter((card) => card.id !== postId).slice(0, 2));
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [postId]);

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingText>게시글을 불러오는 중입니다...</LoadingText>
        </ContentWrapper>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorCard>
            <ErrorText>{error ?? "게시글 정보를 찾을 수 없습니다."}</ErrorText>
            <BackLink href="/community">커뮤니티로 돌아가기</BackLink>
          </ErrorCard>
        </ContentWrapper>
      </Container>
    );
  }

  const paragraphs = splitParagraphs(post.content);
  const isRiskCase = post.caseType === "RISK";

  return (
    <Container>
      <ZoomWrapper width={width} height={height}>
        <ContentWrapper>
          <PostCard>
            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <MetaItem>{post.author}님</MetaItem>
                {post.country && <MetaItem>{post.country}</MetaItem>}
                <MetaItem>작성일 {formatDate(post.createdAt)}</MetaItem>
                <MetaItem>조회수 {post.viewCount}회</MetaItem>
              </PostMeta>
            </PostHeader>

            {isRiskCase && (
              <RiskKeywordsSection>
                <RiskKeywordsLabel>주요 위험 키워드</RiskKeywordsLabel>
                <RiskKeywordsList>
                  {RISK_KEYWORDS.map((keyword) => (
                    <RiskKeywordTag key={keyword}>{keyword}</RiskKeywordTag>
                  ))}
                </RiskKeywordsList>
              </RiskKeywordsSection>
            )}

            <PostContent>
              {paragraphs.length === 0 ? (
                <EmptyText>작성된 본문이 없습니다.</EmptyText>
              ) : (
                paragraphs.map((paragraph, index) => (
                  <Paragraph key={index}>{paragraph}</Paragraph>
                ))
              )}
            </PostContent>
          </PostCard>

          {related.length > 0 && (
            <RelatedSection>
              <RelatedTitle>비슷한 사례 보기</RelatedTitle>
              <RelatedList>
                {related.map((item) => (
                  <RelatedCard key={item.id} href={`/community/${item.id}`}>
                    <RelatedText>
                      {item.summary ||
                        "해당 개선안은 사용자 피드백과도 연결되네요."}
                    </RelatedText>
                    <RelatedTime>5분전</RelatedTime>
                  </RelatedCard>
                ))}
              </RelatedList>
            </RelatedSection>
          )}
        </ContentWrapper>
      </ZoomWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  background-color: #1d1c25;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 58px 0 100px 0;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const LoadingText = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
`;

const ErrorCard = styled.div`
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ErrorText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  text-align: center;
`;

const BackLink = styled(Link)`
  padding: 12px 24px;
  background: #6f00ff;
  border-radius: 24px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const PostCard = styled.div`
  width: 100%;
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  padding: 48px;
`;

const PostHeader = styled.div`
  margin-bottom: 32px;
`;

const PostTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
`;

const MetaItem = styled.span``;

const RiskKeywordsSection = styled.div`
  margin-bottom: 32px;
`;

const RiskKeywordsLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
`;

const RiskKeywordsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const RiskKeywordTag = styled.span`
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const PostContent = styled.div`
  margin-bottom: 32px;
`;

const Paragraph = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
`;

const RelatedSection = styled.div`
  width: 100%;
`;

const RelatedTitle = styled.h2`
  font-size: 19px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
`;

const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RelatedCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const RelatedText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const RelatedTime = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;
