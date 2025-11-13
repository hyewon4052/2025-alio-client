'use client';

import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";


interface NewsArticleData {
    id: string;
    source: string;
    sourceIcon: string;
    title: string;
    timeAgo: string;
}

const featuredArticle: NewsArticleData = {
    id: "featured",
    source: "조선일보",
    sourceIcon: "https://c.animaapp.com/Io1OIwTU/img/image-288-4@2x.png",
    title: "고수익 해외알바 공고 클릭 후 연락두절… 캄보디아 취업 사기 주의",
    timeAgo: "4시간 전",
};

const sideArticles: NewsArticleData[] = [
    {
        id: "side-1",
        source: "조선일보",
        sourceIcon: "https://c.animaapp.com/Io1OIwTU/img/image-288-7@2x.png",
        title: "고수익 해외알바 공고 클릭 후 연락두절… 캄보디아 취업 사기 주의",
        timeAgo: "4시간 전",
    },
    {
        id: "side-2",
        source: "조선일보",
        sourceIcon: "https://c.animaapp.com/Io1OIwTU/img/image-288-7@2x.png",
        title: "현지 체류 중 강제 근무·폭행 피해자 발생, 구조 요청 이어져",
        timeAgo: "4시간 전",
    },
    {
        id: "side-3",
        source: "조선일보",
        sourceIcon: "https://c.animaapp.com/Io1OIwTU/img/image-288-7@2x.png",
        title: "캄보디아 불법 리모트콜센터 모집 광고 주의 — 실제론 범죄조직 연계",
        timeAgo: "4시간 전",
    },
];

const newsGroups = [
    {
        id: "group-1",
        featured: featuredArticle,
        side: sideArticles,
    },
    {
        id: "group-2",
        featured: featuredArticle,
        side: sideArticles,
    },
];

export default function UserAside() {
    return (
        <NewsContainer gap={88}>
            <Flex gap={48}>
                <Text
                    as="h2"
                    fontSize={30}
                    fontWeight={600}
                    color="white"
                >
                    이시각 해외취업 주요 뉴스
                </Text>

                <Flex gap={88}>
                    {newsGroups.map((group) => (
                        <Flex key={group.id} gap={94}>
                            <Flex width={831}>
                                <Flex row gap={56}>
                                    <Flex as="article" gap={22}>
                                        <NewsImage imageUrl={group.featured.source}>
                                            <div style={{ height: '21px' }} />
                                        </NewsImage>

                                        <Flex gap={11}>
                                            <Flex row gap="2.97px" verticalCenter>
                                                <SourceIcon
                                                    src={group.featured.sourceIcon}
                                                    alt=""
                                                />
                                                <Text
                                                    fontSize="11.9px"
                                                    fontWeight={500}
                                                    color="white"
                                                    letterSpacing={-0.24}
                                                    lineHeight="15.8px"
                                                    noWrap
                                                >
                                                    {group.featured.source}
                                                </Text>
                                            </Flex>

                                            <Flex width={310} gap={6}>
                                                <Text
                                                    as="h3"
                                                    fontSize={24}
                                                    fontWeight={600}
                                                    fontFamily="'Pretendard-SemiBold', Helvetica"
                                                    color="white"
                                                    letterSpacing={-0.48}
                                                    lineHeight="31.9px"
                                                >
                                                    {group.featured.title}
                                                </Text>
                                            </Flex>

                                            <Text
                                                as="time"
                                                fontSize={12}
                                                color="#b3b3b3"
                                                letterSpacing={-0.24}
                                                lineHeight="16px"
                                                noWrap
                                            >
                                                {group.featured.timeAgo}
                                            </Text>
                                        </Flex>
                                    </Flex>

                                    {/* Side Articles */}
                                    <Flex flex={1} gap={34} verticalCenter>
                                        {group.side.map((article) => (
                                            <Flex as="article" key={article.id} gap={12}>
                                                <Flex gap={6} verticalCenter>
                                                    <Flex row gap={6} verticalCenter>
                                                        <LargeSourceIcon
                                                            src={article.sourceIcon}
                                                            alt=""
                                                        />
                                                        <Text
                                                            fontSize={20}
                                                            fontWeight={500}
                                                            color="white"
                                                            letterSpacing={-0.4}
                                                            lineHeight="26.6px"
                                                            noWrap
                                                        >
                                                            {article.source}
                                                        </Text>
                                                    </Flex>

                                                    <Flex row gap={20}>
                                                        <Text
                                                            as="h3"
                                                            fontSize={18}
                                                            fontFamily="'Pretendard-Regular', Helvetica"
                                                            color="#b3b3b3"
                                                            letterSpacing={-0.36}
                                                            lineHeight="23.9px"
                                                            noWrap
                                                        >
                                                            {article.title}
                                                        </Text>
                                                    </Flex>
                                                </Flex>

                                                <Text
                                                    as="time"
                                                    fontSize={15}
                                                    color="#b3b3b3"
                                                    letterSpacing={-0.3}
                                                    lineHeight="20px"
                                                    noWrap
                                                >
                                                    {article.timeAgo}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </NewsContainer>
    );
}


const NewsContainer = styled(Flex)`
    width: 898px;
    height: 100%;
    padding: 25px 31px ;
    border-radius: 18px;
    border: 1px solid rgba(155, 155, 155, 0.30);
    background: #22212D;
`;

const NewsImage = styled.div<{ imageUrl: string }>`
  width: 310px;
  height: 220px;
  padding: 8px 18px;
  border-radius: 10px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: 50% 50%;
`;

const SourceIcon = styled.img`
  width: 16.82px;
  height: 15.87px;
  aspect-ratio: 1.06;
`;

const LargeSourceIcon = styled.img`
  width: 28px;
  height: 27px;
  aspect-ratio: 1.06;
`;