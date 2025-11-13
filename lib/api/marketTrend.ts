import apiClient from './client';
import { MarketTrendResponse } from "@/lib/types/recruitment";

export const fetchMarketTrend = async (): Promise<MarketTrendResponse> => {
    const res = await apiClient.get("/api/recruitment/market-trend");
    return res.data;
};
