export interface JobPostingAnalysisRequest {
    type: "url" | "text";
    url?: string | null;
    text?: string | null;
}

export interface JobPostingRiskResponse {
    title: string;
    riskLevel: string;
    riskKeywords: string[];
    analysisResult: string;
    comprehensiveDiagnosis: string;
    actionGuidelines: string;
    summary: string;
}

export interface MarketTrendResponse {
    trendSummary: string;
    keywords: KeywordFrequency[];
    newsSummaries: NewsSummary[];
    industries: IndustryIssue[];
}

export interface KeywordFrequency {
    keyword: string;
    frequency: number;
}

export interface NewsSummary {
    title: string;
    url: string;
    summary: string;
    source: string;
}

export interface IndustryIssue {
    industry: string;
    issueCount: number;
    description: string;
}
