"use client";

import { useMutation } from "@tanstack/react-query";
import { analyzeJobPosting } from "@/lib/api/recruitment";
import { JobPostingAnalysisRequest } from "@/lib/types/recruitment";

export const useJobPostingAnalysis = () => {
    return useMutation({
        mutationFn: (data: JobPostingAnalysisRequest) => analyzeJobPosting(data),
    });
};
