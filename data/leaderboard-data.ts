// src/data/leaderboard-data.ts

import { fetchListedUsers } from "@/app/actions";

export interface Trader {
  name: string;
  pnl: number; // Changed to number
  value: number; // Changed to number
  position?: "left" | "center" | "right";
  walletAddress: string;
  greenTrades: number;
  redTrades: number;
  socials?: string[];
}

export interface RankedTrader extends Trader {
  rank: number;
}

export async function getLeaderboardData() {
  const result = await fetchListedUsers();
  
  if (!result.success || !result.users) return { topTraders: [], rankedTraders: [] };

  // Convert users to traders with numeric values and sort
  const traders = result.users
    .map(user => ({
      name: user.nickname || `Trader ${user.walletAddress.slice(0, 4)}`,
      pnl: (Math.random() * 10000).toFixed(4), // Numeric value
      value: (Math.random() * 50000).toFixed(4), // Numeric value
      walletAddress: user.walletAddress,
      greenTrades: Math.floor(Math.random() * 300).toFixed(4) || 0,
      redTrades: Math.floor(Math.random() * 100).toFixed(4) || 0,
      socials: []
    }))
    .sort((a, b) => b.pnl - a.pnl) // Sort descending by PnL
    .map((trader, index) => ({ ...trader, rank: index + 1 }));

  // Assign positions to top 3
  const topTraders = traders.slice(0, 3).map((trader, index) => ({
    ...trader,
    position: index === 0 ? "center" : index === 1 ? "left" : "right"
  }));

  return {
    topTraders,
    rankedTraders: traders.slice(3)
  };
}