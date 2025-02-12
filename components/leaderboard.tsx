"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, calculateTradePercentages } from "@/lib/utils";
import { getLeaderboardData } from "@/data/leaderboard-data";
import { Switch } from "@/components/ui/switch";
import { toggleLeaderboardListing } from "@/app/actions";
import {
  addUserToDatabase,
  updateUserSocials,
  getUserData,
} from "@/app/actions";
import {
  Twitter,
  MessageCircle,
  Wallet,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { Badge } from "@/components/badge";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SocialMediaModal } from "@/components/social-media-modal";
interface topTraders {
  rank: number;
  name: string;
  pnl: string;
  value: string;
  position?: "left" | "center" | "right";
  walletAddress: string;
  greenTrades: number;
  redTrades: number;
  socials?: string[];
}
[];

export default function Leaderboard() {
  // Replace the static data import with
  const [topTraders, setTopTraders] = useState<topTraders[]>();
  const [rankedTraders, setRankedTraders] = useState<topTraders[]>();

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false);
  const [phantomWalletInstalled, setPhantomWalletInstalled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isListed, setIsListed] = useState(false);

  useEffect(() => {
    getLeaderboardData()
      .then(({ topTraders, rankedTraders }) => {
        setTopTraders(topTraders);
        setRankedTraders(rankedTraders);
      })
      .catch((error) =>
        console.error("Failed to fetch leaderboard data", error)
      );
  }, []);

  // Add this useEffect to sync with user data
  useEffect(() => {
    if (userData) {
      setIsListed(userData.listed);
    }
  }, [userData]);

  // Add this handler
  const handleToggleListing = async () => {
    if (!walletAddress) return;

    const newState = !isListed;
    setIsListed(newState);

    const result = await toggleLeaderboardListing(walletAddress, newState);
    if (!result.success) {
      setIsListed(!newState); // Revert on error
      alert("Failed to update listing status");
    }
  };

  useEffect(() => {
    const checkPhantomWallet = async () => {
      if (
        typeof window !== "undefined" &&
        (window as any).solana &&
        (window as any).solana.isPhantom
      ) {
        setPhantomWalletInstalled(true);
        try {
          const provider = (window as any).solana;
          const response = await provider.connect({ onlyIfTrusted: true });
          const publicKey = response.publicKey.toString();
          setWalletAddress(publicKey);
          setIsWalletConnected(true);
          await fetchUserData(publicKey);
        } catch (error) {
          // User has not previously connected, do nothing
          console.log("User has not previously connected Phantom wallet");
        }
      }
    };

    checkPhantomWallet();
  }, []); //Corrected useEffect dependency

  const fetchUserData = useCallback(async (address: string) => {
    const result = await getUserData(address);
    if (result.success) {
      setUserData(result.user);
    } else {
      console.error("Failed to fetch user data:", result.error);
    }
  }, []);

  const handleConnectWallet = useCallback(async () => {
    if (typeof window === "undefined") {
      console.error("Window object is not available");
      return;
    }

    if (!(window as any).solana || !(window as any).solana.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      const provider = (window as any).solana;
      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      setWalletAddress(publicKey);
      setIsWalletConnected(true);

      // Add user to database and fetch user data
      await addUserToDatabase(publicKey);
      await fetchUserData(publicKey);
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
    }
  }, [fetchUserData]);

  const handleOpenSocialMediaModal = useCallback(() => {
    if (walletAddress) {
      fetchUserData(walletAddress);
    }
    setShowSocialMediaModal(true);
  }, [walletAddress, fetchUserData]);

  const handleSocialSubmit = async (
    nickname: string,
    walletAddress: string,
    socials: Record<string, string>
  ) => {
    try {
      const result = await updateUserSocials(nickname, walletAddress, {
        telegram: socials.telegram || "",
        discord: socials.discord || "",
        twitter: socials.twitter || "",
        twitch: socials.twitch || "",
        kick: socials.kick || "",
      });

      if (result.success) {
        setShowSocialMediaModal(false);
        setUserData(result.user);
        console.log("Successfully updated social information:", result.user);
      } else {
        console.error("Failed to update social information:", result.error);
        alert(`Failed to update social information: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating social information:", error);
      alert(
        `Error updating social information: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              PnL Leaderboard
            </h1>
            <p className="text-gray-400 text-lg">
              Top traders crushing the market
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleOpenSocialMediaModal}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2"
            >
              <span className="relative z-10 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Add Social
              </span>
            </Button>
            <Button
              onClick={handleConnectWallet}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2"
            >
              <span className="relative z-10 flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                {isWalletConnected && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Switch
                      checked={isListed}
                      onCheckedChange={handleToggleListing}
                      className="data-[state=checked]:bg-green-900 data-[state=unchecked]:bg-gray-600"
                    />
                    <span className="text-sm">
                      {isListed ? "Listed" : "Unlisted"}
                    </span>
                  </div>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="daily" className="mb-12">
          <TabsList className="bg-[#1E2028]/50 p-1 rounded-lg inline-flex">
            {["Daily", "Weekly", "Monthly"].map((period) => (
              <TabsTrigger
                key={period}
                value={period.toLowerCase()}
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Top Cards */}
        <div className="max-w-6xl mx-auto mt-8 mb-8 perspective-1000">
          <div className="flex justify-center items-start gap-6">
            {topTraders?.map((trader, i) => (
              <Card
                key={i}
                className={cn(
                  "border-gray-800 relative overflow-visible",
                  "transition-all duration-500 ease-out",
                  trader.position === "center"
                    ? "z-20 w-[340px] transform scale-[1.03] -translate-y-1 translate-z-[30px] p-5 pb-12 pt-4 bg-[#0F1115] hover:opacity-100 hover:scale-[1.05] hover:translate-z-[40px]"
                    : "z-10 w-[300px] transform scale-95 translate-y-0 translate-z-[-10px] opacity-90 hover:opacity-100 hover:scale-100 hover:translate-z-0 p-6 pt-7 bg-[#0F1115]"
                )}
              >
                {trader.position === "left" && <Badge type="silver" />}
                {trader.position === "center" && <Badge type="gold" />}
                {trader.position === "right" && <Badge type="bronze" />}
                <div
                  className={cn(
                    "relative z-10 transition-transform duration-500 flex flex-col items-center text-center",
                    trader.position === "center"
                      ? "transform translateZ(20px) py-1"
                      : "transform translateZ(0px)"
                  )}
                >
                  <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-700 rounded-full" />
                      <SocialLinks />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-1 text-white">
                    {trader.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {trader.walletAddress.slice(0, 5)}
                  </p>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {trader.pnl} ≋
                  </div>
                  <p className="text-gray-400 mb-6">{trader.value}</p>
                  <div className="w-full h-px bg-gray-800 mb-4 relative">
                    <div
                      className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-500/20 to-transparent"
                      style={{
                        width:
                          trader.position === "center"
                            ? "calc(100% + 2.6rem)"
                            : "calc(100% + 3.1rem)",
                        left:
                          trader.position === "center" ? "-1.3rem" : "-1.5rem",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span className="text-sm text-gray-400">
                        {trader.greenTrades}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="text-sm text-gray-400">
                        {trader.redTrades}
                      </span>
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden relative">
                      {(() => {
                        const { greenPercentage, redPercentage } =
                          calculateTradePercentages(
                            trader.greenTrades,
                            trader.redTrades
                          );
                        return (
                          <>
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-transparent"
                              style={{
                                width: `${greenPercentage}%`,
                                clipPath: `polygon(0 0, 100% 50%, 0 100%, 0 0)`,
                              }}
                            />
                            <div
                              className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-400 to-transparent"
                              style={{
                                width: `${redPercentage}%`,
                                clipPath: `polygon(100% 0, 0 50%, 100% 100%, 100% 0)`,
                              }}
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                {trader.position === "center" && (
                  <>
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-x-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
                      <div className="absolute inset-x-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-purple-500/10 via-purple-500/5 to-transparent" />
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* List View */}
        <div className="max-w-6xl mx-auto space-y-2">
          {rankedTraders?.map((trader, i) => (
            <div
              key={i}
              className="bg-[#0F1115] border border-gray-800 rounded-lg p-4 flex items-center"
            >
              <div className="flex items-center gap-4 w-[50%]">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-700 rounded-full" />
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-[#2A2D3A] rounded-full flex items-center justify-center text-xs font-bold text-gray-300 border-2 border-[#1A1D25]">
                    #{trader.rank}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{trader.name}</h3>
                  <div className="flex items-center justify-left gap-4">
                    <p className="text-gray-500 text-sm">
                      {trader.walletAddress}
                    </p>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <Twitter className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-800 mx-4" />
              <div className="flex flex-col items-center gap-2 w-[25%]">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden relative">
                  {(() => {
                    const { greenPercentage, redPercentage } =
                      calculateTradePercentages(
                        trader.greenTrades,
                        trader.redTrades
                      );
                    return (
                      <>
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-transparent"
                          style={{
                            width: `${greenPercentage}%`,
                            clipPath: `polygon(0 0, 100% 50%, 0 100%, 0 0)`,
                          }}
                        />
                        <div
                          className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-400 to-transparent"
                          style={{
                            width: `${redPercentage}%`,
                            clipPath: `polygon(100% 0, 0 50%, 100% 100%, 100% 0)`,
                          }}
                        />
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between w-full text-xs text-gray-400">
                  <span>{trader.greenTrades}</span>
                  <span>{trader.redTrades}</span>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-800 mx-4" />
              <div className="w-[25%] text-right">
                <div className="text-emerald-400 font-bold">{trader.pnl} ≋</div>
                <div className="text-gray-400 text-sm">{trader.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 border border-purple-400/30 relative overflow-hidden group">
            <span className="relative z-10 flex items-center">
              Load More <ChevronDown className="ml-2 h-5 w-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>

        <SocialMediaModal
          isOpen={showSocialMediaModal}
          onClose={() => setShowSocialMediaModal(false)}
          onSubmit={handleSocialSubmit}
          initialSocials={{
            twitter: userData?.twitter || "",
            discord: userData?.discord || "",
            telegram: userData?.telegram || "",
            twitch: userData?.twitch || "",
            kick: userData?.kick || "",
          }}
          walletAddress={walletAddress}
          initialNickname={userData?.nickname || ""}
        />
      </main>
    </div>
  );
}
