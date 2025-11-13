'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import {login} from '@/lib/api/auth';
import {setTokens} from '@/lib/utils/auth';
import type {LoginRequest} from '@/lib/types/auth';
import ZoomedWrapper from "@/components/ZoomWrapper";
import useWindowSize from "@/hooks/useWindowSize";

export default function LoginPage() {
    const {width, height} = useWindowSize();
    const router = useRouter();
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData);
            setTokens(response.tokenResponse.accessToken, response.tokenResponse.refreshToken);
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <ZoomedWrapper width={width} height={height}>
                <CenterBox center>
                    <FormWrapper center>
                        <Flex center gap={10}>
                            <img src="/images/logo.svg" alt="" width={100}/>
                            <Text fontSize={13} fontWeight={400}>해외취업 고민엔</Text>
                        </Flex>

                        <Form onSubmit={handleSubmit}>
                            {error && (
                                <ErrorBox>
                                    <Text fontSize={14} color="#991b1b">
                                        {error}
                                    </Text>
                                </ErrorBox>
                            )}

                            <InputGroup gap={16}>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    placeholder="아이디 작성하기"
                                />

                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="비밀번호 작성하기"
                                />
                            </InputGroup>

                            <SignupLinkWrapper flexEnd>
                                <StyledLink href="/signup">
                                    회원가입하기
                                </StyledLink>
                            </SignupLinkWrapper>

                            <ButtonWrapper center>
                                <SubmitButton type="submit" disabled={loading}>
                                    {loading ? '로그인 중...' : '로그인'}
                                </SubmitButton>
                            </ButtonWrapper>
                        </Form>
                    </FormWrapper>
                </CenterBox>
            </ZoomedWrapper>
        </Container>
    );
}

const Container = styled(Flex)`
    width: 100%;
    height: 100vh;
    background-color: #1D1C25;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const CenterBox = styled(Flex)`
    width: 100%;
    height: 100%;
`;

const FormWrapper = styled(Flex)`
    padding: 2rem;
    background: transparent;
`;

const Form = styled.form`
    margin-top: 2rem;
`;

const ErrorBox = styled(Flex)`
    padding: 1rem;
    border-radius: 0.375rem;
    background-color: #fef2f2;
`;

const InputGroup = styled(Flex)`
    margin-top: 1.5rem;
`;

const Input = styled.input`
    display: block;
    width: 384px;
    height: 57px;
    margin-top: 0.25rem;
    padding: 0.5rem 0.75rem;
    background-color: #272734;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1.10rem;
    line-height: 1.5rem;
    border: none;
    border-radius: 0.5rem;

    &::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    }
`;

const SignupLinkWrapper = styled(Flex)`
    margin-top: 0.5rem;
`;

const StyledLink = styled(Link)`
    font-weight: 400;
    font-size: 13px;
    color: #DBDBDB;

    &:hover {
        color: #3b82f6;
    }
`;

const ButtonWrapper = styled(Flex)`
    margin-top: 51px;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
    width: 184px;
    height: 53px;
    border-radius: 36px;
    background-color: #6F00FF;
    color: white;
    font-size: 17px;
    font-weight: 800;
    border: none;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.7 : 1};

    &:hover {
        opacity: ${props => props.disabled ? 0.7 : 0.9};
    }
`;