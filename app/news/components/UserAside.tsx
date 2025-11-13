'use client';

import styled from "styled-components";
import Flex from "@/components/Flex";
import Text from "@/components/Text";

interface UserActivityData {
    id: string;
    name: string;
    message: string;
}

const userActivities: UserActivityData[] = [
    {
        id: "user-1",
        name: "동민님",
        message: "해당 개선안은 사용자 피드백과도 연결되네요.",
    },
    {
        id: "user-2",
        name: "하니님",
        message:
            "사용자 입장에서는 AI 추천이 아닌 챌린지를 추천받을 수 있는 기능이 있어야할 거 같아요.",
    },
    {
        id: "user-3",
        name: "하니님",
        message:
            "사용자 입장에서는 AI 추천이 아닌 챌린지를 추천받을 수 있는 기능이 있어야할 거 같아요.",
    }
];


export default function UserAside() {
    return (
        <Aside>
            <Text fontWeight={600} color={"#FFFFFF"}>실시간 사용자</Text>
            <Flex gap={12}>
                {userActivities.map((user) => (
                    <UserItem key={user.id}>
                        <Avatar />
                        <Flex gap={3}>
                            <Text fontWeight={600} color={"white"} fontSize={12}>{user.name}</Text>
                            <Text fontWeight={400} color={"#8c8c8c"} fontSize={12}>{user.message}</Text>
                        </Flex>
                    </UserItem>
                ))}
            </Flex>
        </Aside>
    );
}

const Aside = styled(Flex)`
    width: 362px;
    gap: 27px;
    padding: 16px 18px;
    background: #22212d;
    border-radius: 10px;
`;

const UserItem = styled(Flex)`
    flex-direction: row;
    gap: 14px;
    padding: 12px;
    background: #1a1b24;
    border-radius: 8px;
`;

const Avatar = styled.div`
    width: 34px;
    height: 34px;
    background: #4861ff;
    border-radius: 50%;
    flex-shrink: 0;
`;

