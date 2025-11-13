"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarketTrend } from "@/lib/api/marketTrend";

export const useMarketTrend = () => {
    return useQuery({
        queryKey: ["marketTrend"],
        queryFn: fetchMarketTrend,
    });
};