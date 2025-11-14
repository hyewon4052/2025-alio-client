'use client';

import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";
import {useMarketTrend} from "@/hooks/useMarketTrend";

export default function NewsFeed() {

    const {data, isLoading, isError} = useMarketTrend();
    if (isLoading) return <Flex center><Text color="#fff">분석 중...</Text></Flex>;
    if (isError) return <Flex center><Text color="#f00">분석 실패</Text></Flex>;
    if (!data) return null;
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
                    <Flex flex={1} gap={40} verticalCenter>
                        {data?.newsSummaries.map((article) => (
                            <Flex key={article.title} gap={30}>
                                <NewsItem gap={6} onClick={() => window.open(article.url, "_blank")}>
                                    <Text
                                        fontSize={20}
                                        fontWeight={500}
                                        color="white"
                                        letterSpacing={-0.4}
                                        lineHeight="26.6px"
                                        noWrap
                                    >
                                        네이버 뉴스
                                    </Text>
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
                                </NewsItem>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </NewsContainer>
    );
}

const NewsItem = styled(Flex)`
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
`;
const NewsContainer = styled(Flex)`
    width: 898px;
    height: 100%;
    padding: 30px 31px;
    border-radius: 18px;
    border: 1px solid rgba(155, 155, 155, 0.30);
    background: #22212D;
`;