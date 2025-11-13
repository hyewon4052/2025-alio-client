import apiClient from './client';
import type {
    JobPostingAnalysisRequest,
    JobPostingRiskResponse
} from '../types/recruitment';

export const analyzeJobPosting = async (
    data: JobPostingAnalysisRequest
): Promise<JobPostingRiskResponse> => {
    const response = await apiClient.post("/api/recruitment/analyze", data);
    return response.data;
};
