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