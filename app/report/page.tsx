'use client';

import ZoomWrapper from "@/components/common/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useState } from "react";
import { JobPostingRiskResponse } from "@/lib/types/recruitment";
import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";

export default function ReportPage() {
    const {width, height} = useWindowSize();
    const dangerDots = Array.from({length: 5});
    const [data, setData] = useState<JobPostingRiskResponse | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("analysisResult");
        if (stored) setData(JSON.parse(stored));
    }, []);

    if (!data) return <Flex center><Text color="#fff">분석 결과를 불러오는 중...</Text></Flex>;

    return (
        <Container center>
            <ZoomWrapper width={width} height={height}>
                <ReportWrapper center gap={50} row>
                    <MainReportWrapper gap={64}>
                        <TitleWrapper gap={31}>
                            <Text fontSize={33} fontWeight={700}>{data.title}</Text>
                            <Flex gap={15}>
                                <Flex row gap={12} flexStart>
                                    <Text>공고 위험도</Text>
                                    <Flex gap={8} row center>
                                        {dangerDots.map((_, index) => (
                                            <Eclipse
                                                key={index}
                                                active={getDotColor(index, data.riskLevel)}
                                            />
                                        ))}
                                    </Flex>
                                </Flex>
                                <Flex row gap={18} center flexStart>
                                    <Text>주요 위험 키워드</Text>
                                    <Flex row gap={16}>
                                        {data.riskKeywords.slice(0, 6).map((word, index) => (
                                            <KeywordBox key={index} center>
                                                <Text>{word}</Text>
                                            </KeywordBox>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </TitleWrapper>
                        <ResultWrapper gap={50}>
                            <Flex gap={20}>
                                <ResultTitleText>분석 결과</ResultTitleText>
                                <ResultContentText>{data.analysisResult}</ResultContentText>
                            </Flex>
                            <Flex gap={20}>
                                <ResultTitleText>AI 종합 진단</ResultTitleText>
                                <ResultContentText>{data.comprehensiveDiagnosis}</ResultContentText>
                            </Flex>
                            <Flex gap={20}>
                                <ResultTitleText style={{color:"#49DD9F"}}>행동 요령</ResultTitleText>
                                <ResultContentText>{data.actionGuidelines}</ResultContentText>
                            </Flex>
                        </ResultWrapper>
                    </MainReportWrapper>
                    <SideReportWrapper gap={30}>
                        <Text fontSize={23} fontWeight={500}>
                            결과 요약
                        </Text>
                        <DivideLine/>
                        <Text fontSize={18} fontWeight={400}>
                            {data.summary}
                        </Text>
                    </SideReportWrapper>
                </ReportWrapper>
            </ZoomWrapper>
        </Container>
    );
};

function getDotColor(index: number, rate: string) {
    const levels = ["매우 안전", "안전", "주의", "위험", "매우 위험"];
    const levelIndex = levels.indexOf(rate);
    return index <= levelIndex ? "#F50" : "#6F8A87";
}

const DivideLine = styled.div`
    width: 319px;
    height: 0;
    background: #252736;
`;

const ReportWrapper = styled(Flex)`
    align-items: start;
`;

const SideReportWrapper = styled(Flex)`
    width: 379.407px;
    padding: 30.935px 24.566px;
    justify-content: center;
    gap: 9.098px;
    border-radius: 16.377px;
    border: 0.91px solid rgba(255, 255, 255, 0.10);
    background: #22212D;
    align-items: start;
`;

const ResultTitleText = styled.span`
    font-weight: 700;
    font-size: 32px;
    white-space: pre-wrap;
`;

const ResultContentText = styled.span`
    font-weight: 400;
    font-size: 20px;
    white-space: pre-wrap;
    word-break: break-word;
`;

const Container = styled(Flex)`
    width: 100%;
    background-color: #1D1C25;
    justify-content: center;
    align-items: center;
`;

const MainReportWrapper = styled(Flex)`
    width: 886px;
`;
const TitleWrapper = styled(Flex)`

`;

const ResultWrapper = styled(Flex)`

`;
const Eclipse = styled.div<{ active: string }>`
    width: 12.5px;
    height: 12.5px;
    border-radius: 100%;
    background: ${({active}) => active};
`;

const KeywordBox = styled(Flex)`
    height: 32.755px;
    padding: 13.648px 16.377px;
    border-radius: 27.295px;
    background: #252736;
`;
