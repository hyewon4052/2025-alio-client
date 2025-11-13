'use client';

import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";

interface SummaryCardData {
    date: string;
    content: string;
}

interface WordMentionData {
    label: string;
    count: number;
}

interface ChartBarData {
    label: string;
    count: number;
    height: number;
    bgColor: string;
}

const summaryCard: SummaryCardData = {
    date: "2025년 5월 22일",
    content:
        "급여 조건 - 비정상적 현지 리테일 포지션\n대비 월 250만~300만원은 과도하게 높음. \n\n통상 임금보다 약 2~3배 수준.",
};

const wordMentions: WordMentionData[] = [
    {label: "검진 1", count: 1},
    {label: "개선 3", count: 3},
    {label: "수정 중 4", count: 4},
    {label: "미완료 2", count: 2},
];

const chartBars: ChartBarData[] = [
    {label: "프라이버시", count: 1, height: 54, bgColor: "#b3beff"},
    {label: "프라이버시", count: 1, height: 54, bgColor: "#b3beff"},
    {label: "공정성", count: 1, height: 54, bgColor: "#8e9fff"},
    {label: "투명성", count: 2, height: 90, bgColor: "#667bff"},
    {label: "책임성", count: 3, height: 130, bgColor: "#4861ff"},
];


export default function NewsSummaryChart() {
    return (
        <NewsSummaryChartWrapper gap={41} center>
            <Flex spaceBetween flexStart>
                <Flex gap={30} center row>
                    <Text fontSize={28} fontWeight={600} color={"#FFFFFF"}>
                        주요 뉴스 요약 차트
                    </Text>
                    <Flex gap={7} center row>
                        <Text fontSize={16} fontWeight={500} color={"#B1B1B1"}>
                            차트 출처 뉴스
                        </Text>
                        <NumberBox center>
                            <Text fontSize={12} fontWeight={600} color={"#FFFFFF"}>7</Text>
                        </NumberBox>
                    </Flex>
                </Flex>
            </Flex>
            <CardWrapper center gap={20} row>
                <ResultCard center flexStart>
                    <CardInner>
                        <Flex gap={10} center flexStart>
                            <Text fontSize={20} fontWeight={500} color={"#FFFFFF"}>결과 요약</Text>
                            <Text fontSize={11} fontWeight={500} color={"#919191"}>{summaryCard.date}</Text>
                        </Flex>
                        <Divider/>
                        <Text fontSize={15} fontWeight={400} color={"#FFFFFF"}>{summaryCard.content}</Text>
                    </CardInner>
                </ResultCard>

                <article className="relative w-[362px] h-[280px] bg-[#1d1b25] rounded-[10px]">
                    <div className="flex flex-col w-24 items-start gap-[46px] absolute top-9 left-7">
                        <h3 className="relative flex items-center justify-center w-fit mt-[-1.00px] mr-[-6.00px] [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-white text-base tracking-[-0.32px] leading-[21.3px] whitespace-nowrap">
                            많이 언급된 단어
                        </h3>

                        <div className="inline-flex h-[111px] items-start gap-3.5 relative">
                            <img
                                className="relative w-[3px] h-[94.9px]"
                                alt=""
                                src="https://c.animaapp.com/Io1OIwTU/img/line-215.svg"
                                role="presentation"
                            />

                            <ul className="flex flex-col w-[62px] h-[73px] items-start gap-[11px] relative">
                                {wordMentions.map((mention, index) => (
                                    <li
                                        key={index}
                                        className="relative flex items-center justify-center self-stretch [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#b1b1b1] text-[13px] tracking-[-0.26px] leading-[17.3px]"
                                    >
                                        {mention.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="absolute top-[23px] left-[101px] w-[247px] h-[243px]">
                        <div
                            className="absolute top-[105px] left-[87px] h-[19px] [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-white text-[14.3px] tracking-[-0.29px] leading-[19.0px] whitespace-nowrap flex items-center justify-center"
                            role="status"
                            aria-label="진행률"
                        >
                            진행률 70%
                        </div>

                        <div
                            className="absolute top-[127px] left-[90px] h-[11px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-variable-collection-white-100 text-[8.6px] tracking-[-0.17px] leading-[11.4px] whitespace-nowrap flex items-center justify-center">
                            개선률, 점검률 합계
                        </div>

                        <img
                            className="absolute top-[67px] left-[35px] w-[66px] h-[133px]"
                            alt=""
                            src="https://c.animaapp.com/Io1OIwTU/img/ellipse-176.svg"
                            role="presentation"
                        />

                        <img
                            className="absolute top-[35px] left-[57px] w-[148px] h-[74px]"
                            alt=""
                            src="https://c.animaapp.com/Io1OIwTU/img/ellipse-177.svg"
                            role="presentation"
                        />

                        <img
                            className="absolute top-[100px] left-[149px] w-[59px] h-[94px]"
                            alt=""
                            src="https://c.animaapp.com/Io1OIwTU/img/ellipse-178.svg"
                            role="presentation"
                        />

                        <img
                            className="absolute top-[167px] left-[89px] w-[76px] h-[42px]"
                            alt=""
                            src="https://c.animaapp.com/Io1OIwTU/img/ellipse-179.svg"
                            role="presentation"
                        />

                        {[
                            {top: "33px", left: "146px", count: "4"},
                            {top: "116px", left: "23px", count: "3"},
                            {top: "148px", left: "193px", count: "2"},
                            {top: "198px", left: "118px", count: "1"},
                        ].map((badge, index) => (
                            <div
                                key={index}
                                className="flex w-[23px] h-[22px] items-center gap-[5.49px] px-[3.84px] py-[3.3px] absolute backdrop-blur-[4.18px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4.18px)_brightness(100%)]"
                                style={{top: badge.top, left: badge.left}}
                            >
                                <img
                                    className="absolute top-0 left-0 w-[23px] h-[22px]"
                                    alt=""
                                    src="https://c.animaapp.com/Io1OIwTU/img/ellipse-33-3@4x.png"
                                    role="presentation"
                                />

                                <div className="relative w-[15.51px] h-[15.51px] mr-[-0.21px] aspect-[1]">
                      <span
                          className={`${
                              badge.count === "1" ? "w-[32.24%]" : "w-[45.14%]"
                          } top-[2.67%] ${
                              badge.count === "1"
                                  ? "left-[34.26%]"
                                  : "left-[27.82%]"
                          } absolute h-[96.73%] flex items-center justify-center [font-family:'Pretendard-Medium',Helvetica] font-medium text-white text-[11px] tracking-[-0.22px] leading-[14.6px] whitespace-nowrap`}
                      >
                        {badge.count}
                      </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <ChartArticle>
                    <ChartContainer gap={8} verticalCenter flexStart>
                        <Text
                            fontSize={16}
                            fontWeight={600}
                            color="white"
                        >
                            현재 일어나고 있는 순위
                        </Text>

                        <ChartBarsWrapper row gap={20}>
                            {chartBars.map((bar, index) => (
                                <Flex width={78} key={index}>
                                    <Flex center gap={11}>
                                        <Bar height={bar.height} bgColor={bar.bgColor} />

                                        <Text
                                            fontSize={14}
                                            color="#cccccc"
                                            center
                                        >
                                            {bar.label}
                                        </Text>
                                        <CountLabel
                                            fontSize={12}
                                            fontWeight={700}
                                            color={bar.height >= 90 ? 'white' : '#252736'}
                                            isLight={bar.height >= 90}
                                        >
                                            {bar.count}건
                                        </CountLabel>
                                    </Flex>


                                </Flex>
                            ))}
                        </ChartBarsWrapper>
                    </ChartContainer>
                </ChartArticle>
            </CardWrapper>
        </NewsSummaryChartWrapper>
    );
}

const NewsSummaryChartWrapper = styled(Flex)`
    height: 411px;
    padding: 25px 31px;
    border-radius: 18px;
    border: 1px solid rgba(155, 155, 155, 0.30);
    background: #22212D;
`;

const NumberBox = styled(Flex)`
    width: 34px;
    height: 19px;
    padding: 3px 18px;
    gap: 8px;
    border-radius: 20px;
    background: #4861FF;
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
    height: 280px;
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
    align-items: end;
`;

const Bar = styled.div<{ height: number; bgColor: string }>`
    position: relative;
    width: 100%;
    height: ${props => props.height}px;
    background-color: ${props => props.bgColor};
    border-radius: 10px;
`;

const CountLabel = styled(Text)<{ isLight: boolean }>`
    position: absolute;
    bottom: 80px;
    z-index: 2;
`;
