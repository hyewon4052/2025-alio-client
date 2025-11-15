'use client';

import {useMarketTrend} from "@/hooks/useMarketTrend";
import {PieChart, Pie, Cell} from "recharts";
import styled, { keyframes } from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";

const today = new Date();
const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
const COLORS = ["#b3beff", "#8e9fff", "#667bff", "#4861ff"];
const barColors = ["#b3beff", "#8e9fff", "#667bff", "#4861ff", "#7f8cff"];

const shimmer = keyframes`
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
`;

export default function NewsSummaryChart() {

    const {data, isLoading, isError} = useMarketTrend();

    if (isError) return (
        <NewsSummaryChartWrapper gap={35} center>
            <Flex center>
                <Text color="#f00">분석 실패</Text>
            </Flex>
        </NewsSummaryChartWrapper>
    );

    if (isLoading) {
        return (
            <NewsSummaryChartWrapper gap={35} center>
                <Flex center flexStart>
                    <Flex>
                        <SkeletonText width="200px" height="34px" />
                    </Flex>
                    <CardWrapper center gap={20} row>
                        <LoadingResultCard center flexStart>
                            <CardInner>
                                <Flex gap={10} center flexStart>
                                    <SkeletonText width="100px" height="24px" />
                                    <SkeletonText width="120px" height="13px" />
                                </Flex>
                                <Divider />
                                <SkeletonText width="100%" height="20px" />
                                <SkeletonText width="80%" height="20px" />
                                <SkeletonText width="90%" height="20px" />
                            </CardInner>
                        </LoadingResultCard>

                        <LoadingChartWrapper center>
                            <Flex gap={10}>
                                <SkeletonText width="150px" height="19px" />
                                <Flex row gap={40}>
                                    <Flex gap={11}>
                                        {[...Array(4)].map((_, i) => (
                                            <SkeletonText key={i} width="60px" height="16px" />
                                        ))}
                                    </Flex>
                                    <SkeletonCircle width="180px" height="180px" />
                                </Flex>
                            </Flex>
                        </LoadingChartWrapper>

                        <LoadingChartArticle>
                            <ChartContainer gap={8} verticalCenter flexStart>
                                <SkeletonText width="180px" height="19px" />
                                <ChartBarsWrapper row gap={20} center>
                                    {[80, 60, 90, 70, 85].map((height, i) => (
                                        <Flex key={i} width={78} center>
                                            <BarWrapper flexEnd>
                                                <SkeletonBar height={height} />
                                                <SkeletonText width="40px" height="14px" />
                                            </BarWrapper>
                                            <IndustryTextWrapper>
                                                <SkeletonText width="60px" height="16px" />
                                            </IndustryTextWrapper>
                                        </Flex>
                                    ))}
                                </ChartBarsWrapper>
                            </ChartContainer>
                        </LoadingChartArticle>
                    </CardWrapper>
                </Flex>
            </NewsSummaryChartWrapper>
        );
    }

    if (!data) return null;

    const maxBarHeight = 100;
    const maxIssueCount = Math.max(...data.industries.map(ind => ind.issueCount));

    const bars = data.industries.map((ind, i) => {
        const height = (ind.issueCount / maxIssueCount) * maxBarHeight;
        const bgColor = barColors[i] || "#7f8cff";
        return {...ind, height, bgColor};
    });
    const top4 = data.keywords.slice(0, 4);
    const top1 = top4[0];

    const pieData = top4.map((k) => ({name: k.keyword, value: k.frequency}));

    return (
        <NewsSummaryChartWrapper gap={35} center>
            <Flex center flexStart>
                <Flex>
                    <Text fontSize={28} fontWeight={600} color={"#FFFFFF"}>
                        주요 뉴스 요약 차트
                    </Text>
                </Flex>
                <CardWrapper center gap={20} row>
                    <ResultCard center flexStart>
                        <CardInner>
                            <Flex gap={10} center flexStart>
                                <Text fontSize={20} fontWeight={500} color={"#FFFFFF"}>결과 요약</Text>
                                <Text fontSize={11} fontWeight={500} color={"#919191"}>{formattedDate}</Text>
                            </Flex>
                            <Divider/>
                            <Text fontSize={15} fontWeight={400} color={"#FFFFFF"}>{data.trendSummary}</Text>
                        </CardInner>
                    </ResultCard>

                    <ChartWrapper center>
                        <Flex gap={10}>
                            <Text fontSize={16} fontWeight={600}>많이 언급된 단어</Text>
                            <Flex row gap={40}>
                                <Flex gap={11}>
                                    {top4.map((k, i) => (
                                        <Text key={i} color="#B1B1B1" fontSize={13}>
                                            {k.keyword} {k.frequency}
                                        </Text>
                                    ))}
                                </Flex>

                                <div style={{position: "relative", width: 180, height: 180}}>
                                    <PieChart width={180} height={180}>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                    </PieChart>

                                    {top1 && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Flex>
                                                <Text fontSize={16} fontWeight={700} color="#fff">
                                                    {top1.keyword}
                                                </Text>
                                                <Text fontSize={12} color="#ccc">
                                                    검색 순위 1위
                                                </Text>
                                            </Flex>
                                        </div>
                                    )}
                                </div>
                            </Flex>
                        </Flex>
                    </ChartWrapper>

                    <ChartArticle>
                        <ChartContainer gap={8} verticalCenter flexStart>
                            <Text
                                fontSize={16}
                                fontWeight={600}
                                color="white"
                            >
                                주목되고 있는 산업군
                            </Text>
                            <ChartBarsWrapper row gap={20} center>
                                {bars.slice(0, 5).map((bar, i) => (
                                    <Flex key={i} width={78} center>
                                        <BarWrapper flexEnd>
                                            <Bar $height={bar.height} $bgColor={bar.bgColor}/>
                                            <CountLabel
                                                fontSize={12}
                                                fontWeight={700}
                                                color={bar.height >= 90 ? "white" : "#252736"}
                                            >
                                                {bar.issueCount}건
                                            </CountLabel>
                                        </BarWrapper>
                                        <IndustryTextWrapper>
                                            <Text
                                                fontSize={14}
                                                color="#cccccc"
                                                center
                                                style={{
                                                    position: "relative",
                                                    bottom: "-10px",
                                                    textAlign: "center",
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                {bar.industry}
                                            </Text>
                                        </IndustryTextWrapper>
                                    </Flex>
                                ))}
                            </ChartBarsWrapper>
                        </ChartContainer>
                    </ChartArticle>
                </CardWrapper>
            </Flex>
        </NewsSummaryChartWrapper>
    );
}

const IndustryTextWrapper = styled(Flex)`
    position: absolute;
    top: 260px;
    width: 77px;
`;

const NewsSummaryChartWrapper = styled(Flex)`
    padding: 25px 31px;
    border-radius: 18px;
    border: 1px solid rgba(155, 155, 155, 0.30);
    background: #22212D;
    height: 500px;
`;

const ResultCard = styled(Flex)`
    width: 320px;
    padding: 26px 20px;
    background: #1c1a24;
    border-radius: 12px;
    border: 0.766px solid rgba(255, 255, 255, 0.10);
`;

const CardInner = styled(Flex)`
    width: 268px;
    align-items: flex-start;
    gap: 21.44px;
    position: relative;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: #252736;
`;

const CardWrapper = styled(Flex)`
    position: relative;
`;

const ChartArticle = styled.article`
    width: 526px;
    height: 320px;
`;

const ChartContainer = styled(Flex)`
    width: 100%;
    height: 100%;
    padding: 2px 30px;
    background-color: #1d1b25;
    border-radius: 10px;
`;
const ChartBarsWrapper = styled(Flex)`
    height: 180px;
    width: 100%;
    align-items: flex-end;
`;

const BarWrapper = styled(Flex)`
    position: relative;
    width: 100%;
`;

const ChartWrapper = styled(Flex)`
    width: 362px;
    height: 320px;
    padding: 11px 18px;
    gap: 10px;
    border-radius: 10px;
    background: #1D1B25;
`;

const Bar = styled.div<{ $height: number; $bgColor: string }>`
    width: 100%;
    height: ${(props) => props.$height}px;
    background-color: ${(props) => props.$bgColor};
    border-radius: 10px;
    position: relative;
    bottom: 0;
`;

const CountLabel = styled(Text)`
    position: absolute;
    bottom: 3px;
    width: 100%;
    text-align: center;
    color: white;
    font-weight: 700;
    font-size: 12px;
`;

const SkeletonText = styled.div<{ width: string; height: string }>`
    width: ${props => props.width};
    height: ${props => props.height};
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    border-radius: 4px;
    animation: ${shimmer} 2s infinite;
`;

const SkeletonCircle = styled.div<{ width: string; height: string }>`
    width: ${props => props.width};
    height: ${props => props.height};
    border-radius: 50%;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
`;

const SkeletonBar = styled.div<{ height: number }>`
    width: 100%;
    height: ${props => props.height}px;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    border-radius: 10px;
    animation: ${shimmer} 2s infinite;
`;

const LoadingResultCard = styled(ResultCard)`
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        animation: ${shimmer} 2s infinite;
    }
`;

const LoadingChartWrapper = styled(ChartWrapper)`
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        animation: ${shimmer} 2s infinite;
    }
`;

const LoadingChartArticle = styled(ChartArticle)`
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        animation: ${shimmer} 2s infinite;
    }
`;
