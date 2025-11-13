'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";
import { createNewsComment, getRecentNewsComments } from '@/lib/api/news';
import { NewsComment } from '@/lib/types/news';

export default function UserAside() {
    const router = useRouter();
    const [comments, setComments] = useState<NewsComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await getRecentNewsComments(3);
            setComments(data);
        } catch (error: any) {
            console.error('Failed to fetch comments', error);
            if (error?.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            await createNewsComment({ content: newComment.trim() });
            setNewComment('');
            await fetchComments();
        } catch (error: any) {
            console.error('Failed to create comment', error);
            if (error?.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Aside>
            <Text fontWeight={600} color={"#FFFFFF"}>뉴스 댓글</Text>
            <CommentForm onSubmit={handleSubmit}>
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    maxLength={500}
                />
                <SubmitButton type="submit" disabled={submitting || !newComment.trim()}>
                    {submitting ? '작성 중...' : '작성'}
                </SubmitButton>
            </CommentForm>
            <Flex gap={12}>
                {loading ? (
                    <Text color={"#8c8c8c"} fontSize={12}>로딩 중...</Text>
                ) : comments.length === 0 ? (
                    <Text color={"#8c8c8c"} fontSize={12}>아직 댓글이 없습니다.</Text>
                ) : (
                    comments.map((comment) => (
                        <UserItem key={comment.id}>
                            <Avatar />
                            <Flex gap={3}>
                                <Text fontWeight={600} color={"white"} fontSize={12}>익명</Text>
                                <Text fontWeight={400} color={"#8c8c8c"} fontSize={12}>{comment.content}</Text>
                            </Flex>
                        </UserItem>
                    ))
                )}
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

const CommentForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
`;

const CommentInput = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #ffffff;
    font-size: 12px;
    resize: none;
    outline: none;
    min-height: 60px;
    font-family: inherit;

    &::placeholder {
        color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
        border-color: #4861ff;
        background: rgba(255, 255, 255, 0.08);
    }
`;

const SubmitButton = styled.button`
    padding: 8px 16px;
    background: #4861ff;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    align-self: flex-end;

    &:hover:not(:disabled) {
        background: #3a4fcc;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

