'use client';

import ZoomWrapper from "@/components/common/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";
import UserAside from "./components/UserAside";
import NewsSummaryChart from "./components/NewsSummaryChart";
import NewsFeed from "./components/NewsFeed";
import styled from "styled-components";
import Flex from "@/components/common/Flex";

export default function NewsPage() {
    const {width, height} = useWindowSize();

    return (
        <Container center>
            <ZoomWrapper width={width} height={height}>
                <Flex center gap={60}>
                    <NewsSummaryChart/>
                    <NewsSection gap={65}>
                        <NewsFeed/>
                        <UserAside/>
                    </NewsSection>
                </Flex>
            </ZoomWrapper>
        </Container>
    );
};

const Container = styled(Flex)`
    width: 100%;
    background-color: #1D1C25;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 370px;
    padding-top: 58px;
`;

const NewsSection = styled(Flex)`
    position: relative;
    flex-direction: row;
    align-items: start;
`;