export interface Trader {
  name: string
  pnl: string
  value: string
  position?: "left" | "center" | "right"
  walletAddress: string
  greenTrades: number
  redTrades: number
  socials?: string[]
}

export interface RankedTrader extends Trader {
  rank: number
}

const leaderboardData: {
  topTraders: Trader[]
  rankedTraders: RankedTrader[]
} = {
  topTraders: [
    {
      name: "Mr. Frog",
      pnl: "+77.54",
      value: "$116,342.4",
      position: "left",
      walletAddress: "6sdE9C...dD4Sca",
      greenTrades: 212,
      redTrades: 43,
    },
    {
      name: "Orangie",
      pnl: "+544.34",
      value: "$116,342.4",
      position: "center",
      walletAddress: "6sdE9C...dD4Sca",
      greenTrades: 212,
      redTrades: 43,
    },
    {
      name: "Moneymakah",
      pnl: "+123.44",
      value: "$116,342.4",
      position: "right",
      walletAddress: "6sdE9C...dD4Sca",
      greenTrades: 212,
      redTrades: 43,
    },
  ],
  rankedTraders: [
    {
      rank: 4,
      name: "CryptoKing",
      pnl: "231,584",
      value: "$323,323.2",
      walletAddress: "7xdF3B...eE5Tdb",
      greenTrades: 312,
      redTrades: 21,
    },
    {
      rank: 5,
      name: "BlockchainBoss",
      pnl: "198,721",
      value: "$278,209.4",
      walletAddress: "9yqG7H...fF6Uec",
      greenTrades: 287,
      redTrades: 34,
    },
    {
      rank: 6,
      name: "SatoshiDisciple",
      pnl: "176,543",
      value: "$247,160.2",
      walletAddress: "2zaK1L...hH8Wgd",
      greenTrades: 256,
      redTrades: 45,
    },
    {
      rank: 7,
      name: "HODLer4Life",
      pnl: "154,321",
      value: "$216,049.4",
      walletAddress: "5xbM4N...iI9Xfe",
      greenTrades: 231,
      redTrades: 52,
    },
    {
      rank: 8,
      name: "AltcoinAlchemist",
      pnl: "132,109",
      value: "$184,952.6",
      walletAddress: "3vcP8R...jJ1Ygh",
      greenTrades: 198,
      redTrades: 67,
    },
    {
      rank: 9,
      name: "DeFiDreamer",
      pnl: "109,876",
      value: "$153,826.4",
      walletAddress: "1wqS2T...kK3Zih",
      greenTrades: 176,
      redTrades: 78,
    },
    {
      rank: 10,
      name: "NFTNinja",
      pnl: "87,654",
      value: "$122,715.6",
      walletAddress: "4uoL6P...mM5Wkj",
      greenTrades: 154,
      redTrades: 89,
    },
    {
      rank: 11,
      name: "MetaverseMonarch",
      pnl: "65,432",
      value: "$91,604.8",
      walletAddress: "8ipR9T...nN7Xlk",
      greenTrades: 132,
      redTrades: 98,
    },
    {
      rank: 12,
      name: "TokenTycoon",
      pnl: "43,210",
      value: "$60,494.0",
      walletAddress: "0lmQ1S...oO9Ygl",
      greenTrades: 110,
      redTrades: 107,
    },
  ],
}

export function getLeaderboardData() {
  return leaderboardData
}

export function addUserData(walletAddress: string, socials: string[]) {
  // This is a simple implementation. In a real-world scenario, you'd want to:
  // 1. Check if the user already exists
  // 2. Update the user if they exist, or add them if they don't
  // 3. Possibly re-rank the leaderboard based on the user's performance

  const newUser: RankedTrader = {
    rank: leaderboardData.rankedTraders.length + 1,
    name: `User ${leaderboardData.rankedTraders.length + 1}`,
    pnl: "0",
    value: "$0",
    walletAddress,
    greenTrades: 0,
    redTrades: 0,
    socials,
  }

  leaderboardData.rankedTraders.push(newUser)
}

