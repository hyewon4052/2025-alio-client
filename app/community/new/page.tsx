'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Flex from '@/components/common/Flex';
import ZoomWrapper from '@/components/common/ZoomWrapper';
import useWindowSize from '@/hooks/useWindowSize';
import { createCommunityPost } from '@/lib/api/community';
import { CommunityCaseType } from '@/lib/types/community';

const PRESET_KEYWORDS = [
  '치안 안 좋음',
  '물가 비쌈',
  '언어 장벽',
  '비자 문제',
  '숙소 문제',
  '문화 차이',
  '고용 조건',
  '생활비',
  '의료 시설',
  '교통 불편',
];

const COUNTRIES = [
  '캄보디아',
  '일본',
  '싱가포르',
  '미국',
  '영국',
];

export default function CommunityCreatePage() {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [caseType, setCaseType] = useState<CommunityCaseType>('RISK');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      if (tags.length < 10) {
        setTags([...tags, tag]);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim() || tags.length === 0 || !country) {
      setError('필수 항목(제목, 글, 키워드, 국가)을 모두 입력해주세요.');
      return;
    }

    if (title.length > 20) {
      setError('제목은 최대 20자까지 입력 가능합니다.');
      return;
    }

    if (content.length > 1000) {
      setError('본문은 최대 1000자까지 입력 가능합니다.');
      return;
    }

    try {
      setError(undefined);
      setLoading(true);
      const response = await createCommunityPost({
        title: title.trim(),
        content: content.trim(),
        rating: 3,
        caseType,
        tags,
        isAnonymous,
        country,
      });
      router.replace(`/community/${response.id}`);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        router.push('/login');
      } else {
        setError('후기를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ZoomWrapper width={width} height={height}>
        <FormWrapper>
          <Form onSubmit={handleSubmit}>
            <Section>
              <Label>
                익명 여부 선택 <Required>*</Required>
              </Label>
              <ButtonGroup>
                <ToggleButton
                  type="button"
                  $active={isAnonymous}
                  onClick={() => setIsAnonymous(true)}
                >
                  익명
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={!isAnonymous}
                  onClick={() => setIsAnonymous(false)}
                >
                  실명 공개
                </ToggleButton>
              </ButtonGroup>
            </Section>

            <Section>
              <Label>
                국가 선택 <Required>*</Required>
              </Label>
              <Select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                <option value="">국가를 선택해주세요</option>
                {COUNTRIES.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </Select>
            </Section>

            <Section>
              <LabelRow>
                <Label>
                  제목 작성 <Required>*</Required>
                </Label>
                <CharLimit>최대 20자</CharLimit>
              </LabelRow>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="주요 AI 기능 설명을 해주세요. 해당내용은 프롬프트로 이용됩니다."
                maxLength={20}
              />
            </Section>

            <Section>
              <LabelRow>
                <Label>
                  글 작성 <Required>*</Required>
                </Label>
                <CharLimit>최대 1000자</CharLimit>
              </LabelRow>
              <TextArea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="주요 AI 기능 설명을 해주세요. 해당내용은 프롬프트로 이용됩니다."
                rows={12}
                maxLength={1000}
              />
            </Section>

            <Section>
              <LabelRow>
                <Label>
                  주요 키워드 <Required>*</Required>
                </Label>
                <AddKeywordButton
                  type="button"
                  onClick={() => {
                    if (tags.length < 10) {
                      const available = PRESET_KEYWORDS.filter((k) => !tags.includes(k));
                      if (available.length > 0) {
                        setTags([...tags, available[0]]);
                      }
                    }
                  }}
                >
                  <PlusIcon>+</PlusIcon>
                  키워드 추가
                </AddKeywordButton>
              </LabelRow>
              <KeywordGrid>
                {PRESET_KEYWORDS.map((keyword) => (
                  <KeywordButton
                    key={keyword}
                    type="button"
                    $selected={tags.includes(keyword)}
                    onClick={() => toggleTag(keyword)}
                  >
                    {keyword}
                  </KeywordButton>
                ))}
              </KeywordGrid>
            </Section>

            {error && (
              <ErrorBox>
                {error}
              </ErrorBox>
            )}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '저장 중...' : '완료'}
            </SubmitButton>
          </Form>
        </FormWrapper>
      </ZoomWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  background-color: #1D1C25;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 58px 0 100px 0;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
`;

const Form = styled.form`
  width: 100%;
  background: #23222e;
  border: 1px solid #22212d;
  border-radius: 12px;
  padding: 56px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const Required = styled.span`
  color: #6F00FF;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharLimit = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 16px 20px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.$active ? '#272734' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};

  &:hover {
    background-color: ${props => props.$active ? '#272734' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;
  padding-right: 50px;
  cursor: pointer;

  option {
    background-color: #272734;
    color: #ffffff;
  }

  &:focus {
    border-color: #6F00FF;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-color: #6F00FF;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  resize: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-color: #6F00FF;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const AddKeywordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(111, 0, 255, 0.2);
  border: none;
  border-radius: 20px;
  font-size: 12px;
  color: rgba(111, 0, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(111, 0, 255, 0.3);
  }
`;

const PlusIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #6F00FF;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KeywordGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const KeywordButton = styled.button<{ $selected: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.$selected ? '#6F00FF' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$selected ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};

  &:hover {
    background-color: ${props => props.$selected ? '#6F00FF' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ErrorBox = styled.div`
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: 20px 40px;
  background: #272734;
  border: none;
  border-radius: 24px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2d2d3a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
