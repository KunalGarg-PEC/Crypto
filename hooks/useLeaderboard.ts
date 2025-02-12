// hooks/useLeaderboard.ts
import { useState, useEffect, useCallback } from "react";
import { getLeaderboardData } from "@/data/leaderboard-data";

export function useLeaderboard() {
  const [topTraders, setTopTraders] = useState<any[]>([]);
  const [rankedTraders, setRankedTraders] = useState<any[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { topTraders, rankedTraders } = await getLeaderboardData();
      setTopTraders(topTraders);
      setRankedTraders(rankedTraders);
    } catch (error) {
      console.error("Failed to fetch leaderboard data", error);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Optional polling for real-time updates every 10 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return { topTraders, rankedTraders, fetchLeaderboard };
}
