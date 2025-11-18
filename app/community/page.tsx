"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Flex from "@/components/common/Flex";
import ZoomWrapper from "@/components/common/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";
import { getCaseArchive, getCommunityPosts } from "@/lib/api/community";
import { CaseArchiveItem, CommunityPostSummary } from "@/lib/types/community";

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function CommunityPage() {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPostSummary[]>([]);
  const [archives, setArchives] = useState<CaseArchiveItem[]>([]);
  const [sortOption, setSortOption] = useState<"popular" | "recent">("popular");
  const [country, setCountry] = useState("전체");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoadingInitial(true);
        const archiveData = await getCaseArchive();
        setArchives(archiveData);
      } catch (error) {
        console.error("Failed to load community summary", error);
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
        const list = await getCommunityPosts();
        setPosts(list);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // 국가별 필터링
    if (country !== "전체") {
      filtered = filtered.filter((post) => post.country === country);
    }

    // 정렬
    if (sortOption === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    }

    return filtered;
  }, [posts, sortOption, country]);

  return (
    <Container>
      <ZoomWrapper width={width} height={height}>
        <ContentWrapper>
          <HeaderSection>
            <WriteButton href="/community/new">글쓰기</WriteButton>
          </HeaderSection>

          <FilterRow>
            <FilterGroup>
              <FilterLabel>인기순</FilterLabel>
              <Select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as "popular" | "recent")
                }
              >
                <option value="popular">인기순</option>
                <option value="recent">최신순</option>
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>국가 선택</FilterLabel>
              <Select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {["전체", "캄보디아", "일본", "싱가포르", "미국", "영국"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </Select>
            </FilterGroup>
          </FilterRow>

          <ArchiveRow>
            {["캄보디아", "일본", "싱가포르"].map((country, idx) => {
              const relatedPosts = posts
                .filter((post) => post.country === country)
                .slice(0, 5);

              return (
                <ArchiveCard key={idx}>
                  <CardHeader>
                    <CardTitle>{country} 실시간 취업자 현황 아카이브</CardTitle>
                    <UpdateButton>5분전 업데이트</UpdateButton>
                  </CardHeader>
                  <AISummaryContainer>
                    <StarIcon>★</StarIcon>
                    <AILabel>AI요약:</AILabel>
                    <AISummaryText>
                      {country === "캄보디아" &&
                        "고수익 해외알바 공고를 통해 유인한 후 연락두절, 비자 정보 없이 즉시 출국 요구, 숙소 제공 조건 불명확 등의 피해 사례가 다수 보고되고 있습니다. 특히 텔레그램이나 카카오톡으로만 면접을 진행하고 공식 서류 없이 즉시 합격을 약속하는 경우는 거의 100% 사기입니다."}
                      {country === "일본" &&
                        "비자 발급 지연으로 인한 계약 불이행, 고용 계약서와 실제 근로 조건의 불일치, 숙소 제공 약속 후 고액 보증금 요구 등이 빈번하게 발생하고 있습니다. 일본어 능력이 부족한 상태에서 취업을 시도할 경우 계약서 내용을 제대로 이해하지 못해 불공정한 조건에 동의하게 되는 경우가 많습니다."}
                      {country === "싱가포르" &&
                        "숙소 제공 조건이 불명확하거나 고액 보증금을 요구하는 경우, 비자 스폰서십을 약속했으나 실제로는 관광 비자로 입국하게 하는 경우 등이 주요 문제점입니다. 싱가포르는 물가가 매우 높아 생활비 부담이 크므로, 충분한 자금을 확보하지 않은 상태에서 취업을 시도하는 것은 위험합니다."}
                    </AISummaryText>
                  </AISummaryContainer>
                  {relatedPosts.length > 0 && (
                    <FeedbackContainer>
                      {relatedPosts.map((post) => (
                        <FeedbackRow key={post.id}>
                          <PurpleIcon />
                          <FeedbackContent>
                            <FeedbackText>{post.title}</FeedbackText>
                          </FeedbackContent>
                        </FeedbackRow>
                      ))}
                    </FeedbackContainer>
                  )}
                </ArchiveCard>
              );
            })}
          </ArchiveRow>

          <TableContainer>
            <Table>
              <TableHead>
                <TableHeaderRow>
                  <TableHeaderCell>번호</TableHeaderCell>
                  <TableHeaderCell>제목</TableHeaderCell>
                  <TableHeaderCell>작성일</TableHeaderCell>
                  <TableHeaderCell>작성자</TableHeaderCell>
                  <TableHeaderCell>조회수</TableHeaderCell>
                </TableHeaderRow>
              </TableHead>
              <TableBody>
                {loadingPosts ? (
                  <TableRow>
                    <TableCell colSpan={5} $center>
                      후기를 불러오는 중입니다...
                    </TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} $center>
                      아직 등록된 후기가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post, index) => (
                    <TableRow
                      key={post.id}
                      onClick={() => router.push(`/community/${post.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell>
                        <PostLink
                          href={`/community/${post.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.title}
                        </PostLink>
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.viewCount}회</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
  padding-top: 74px;
  padding-bottom: 100px;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const WriteButton = styled(Link)`
  padding: 12px 24px;
  background-color: #6f00ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a00cc;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.span`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
`;

const Select = styled.select`
  padding: 10px 20px;
  background-color: #272734;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  min-width: 120px;

  option {
    background-color: #272734;
    color: #ffffff;
  }
`;

const ArchiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
`;

const ArchiveCard = styled.div`
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  padding: 24px;
  min-height: 280px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
  line-height: 1.5;
`;

const UpdateButton = styled.button`
  padding: 4px 12px;
  background-color: #3b82f6;
  border: none;
  border-radius: 12px;
  font-size: 10px;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 12px;
`;

const AISummaryContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 16px;
`;

const StarIcon = styled.span`
  color: #6f00ff;
  font-size: 14px;
  line-height: 1.2;
  flex-shrink: 0;
`;

const AILabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6f00ff;
  white-space: nowrap;
  flex-shrink: 0;
`;

const AISummaryText = styled.span`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
`;

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeedbackRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const PurpleIcon = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6f00ff;
  flex-shrink: 0;
  margin-top: 8px;
`;

const FeedbackContent = styled.div`
  flex: 1;
`;

const FeedbackText = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  display: block;
`;

const TableContainer = styled.div`
  width: 100%;
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
`;

const TableHead = styled.thead``;

const TableHeaderRow = styled.tr`
  background-color: rgba(255, 255, 255, 0.02);
`;

const TableHeaderCell = styled.th`
  padding: 20px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const TableCell = styled.td<{ $center?: boolean }>`
  padding: 20px 24px;
  font-size: 15px;
  color: #ffffff;
  text-align: ${(props) => (props.$center ? "center" : "left")};
`;

const PostLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  display: block;
  width: 100%;
  padding: 20px 24px;
  margin: -20px -24px;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:hover {
    color: #6f00ff;
  }
`;
