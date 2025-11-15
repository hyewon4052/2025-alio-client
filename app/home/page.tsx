'use client';

import styled, { keyframes, css } from "styled-components";
import ZoomWrapper from "@/components/common/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";
import Flex from "@/components/common/Flex";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useJobPostingAnalysis} from "@/hooks/useJobPostingAnalysis";

const shimmer = keyframes`
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
`;

export default function HomePage() {
    const { width, height } = useWindowSize();
    const [input, setInput] = useState("");
    const router = useRouter();
    const mutation = useJobPostingAnalysis();

    const handleAnalyze = async () => {
        if (!input.trim()) return alert("URL 또는 텍스트를 입력해주세요!");
        mutation.mutate(
            {
                type: input.startsWith("http") ? "url" : "text",
                url: input.startsWith("http") ? input : null,
                text: !input.startsWith("http") ? input : null,
            },
            {
                onSuccess: (data) => {
                    sessionStorage.setItem("analysisResult", JSON.stringify(data));
                    router.push("/report");
                },
                onError: (err) => {
                    alert("분석 중 오류가 발생했습니다.");
                    console.error(err);
                },
            }
        );
    };

    return (
        <Container center>
            <ZoomWrapper width={width} height={height}>
                <Flex center>
                    <HeaderSection center gap={17} style={{marginTop: 190}}>
                        <Title>해외취업 공고를 등록해보세요!</Title>
                        <SubTitle>
                            해외취업 공고의 정보를 빠르게 팩트 체크 받을 수 있습니다.
                        </SubTitle>
                    </HeaderSection>
                    <LoadingUploadBox 
                        $isLoading={mutation.isPending}
                        gap={42} 
                        style={{marginTop: 50}}
                    >
                        <Flex row center gap={16} width="100%">
                            {mutation.isPending ? (
                                <>
                                    <SkeletonInput />
                                    <SkeletonButton />
                                </>
                            ) : (
                                <>
                                    <StyledInput
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="공고의 url, 텍스트, 스크린샷을 등록해주세요!"
                                    />
                                    <UploadButton onClick={handleAnalyze} disabled={mutation.isPending}>
                                        <svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M22 2L11 13"
                                                stroke="#7c7c7c"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M22 2L15 22L11 13L2 9L22 2Z"
                                                stroke="#7c7c7c"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </UploadButton>
                                </>
                            )}
                        </Flex>
                    </LoadingUploadBox>
                </Flex>
            </ZoomWrapper>
        </Container>
    );
}

const Container = styled(Flex)`
    width: 100%;
    height: 100vh;
    background-color: #1D1C25;
`;

const HeaderSection = styled(Flex)`
    width: 100%;
    padding-top:190px;
`;

const Title = styled.div`
    font-weight: 700;
    color: #ffffff;
    font-size: 37.2px;
    text-align: center;
`;

const SubTitle = styled.p`
    font-weight: 400;
    color: #ffffff;
    font-size: 20px;
    letter-spacing: 0;
    line-height: normal;
    text-align: center;
`;

const UploadBox = styled(Flex)`
    width: 100%;
    max-width: 1081px;
    padding: 35px 37px;
    background: #23222e;
    border: 1px solid #22212d;
    border-radius: 12px;
`;

const LoadingUploadBox = styled(UploadBox)<{ $isLoading: boolean }>`
    position: relative;
    overflow: hidden;
    
    ${props => props.$isLoading ? css`
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
    ` : ''}
`;

const SkeletonInput = styled.div`
    flex: 1;
    height: 24px;
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

const SkeletonButton = styled.div`
    flex-shrink: 0;
    width: 24px;
    height: 24px;
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

const StyledInput = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 20px;
    font-weight: 400;

    &::placeholder {
        color: #7c7c7c;
    }
`;

const UploadButton = styled.button`
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
`;