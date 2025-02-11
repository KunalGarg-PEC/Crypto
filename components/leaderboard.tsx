"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, calculateTradePercentages } from "@/lib/utils";
import { getLeaderboardData } from "@/data/leaderboard-data";
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

export default function Leaderboard() {
  const { topTraders, rankedTraders } = getLeaderboardData();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false);
  const [phantomWalletInstalled, setPhantomWalletInstalled] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkPhantomWallet = async () => {
      if (
        typeof window !== "undefined" &&
        (window as any).solana  &&
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
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 border border-green-400/30 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Add Social
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button
              onClick={handleConnectWallet}
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 border border-purple-400/30 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                {isWalletConnected
                  ? `Connected: ${walletAddress?.slice(
                      0,
                      4
                    )}...${walletAddress?.slice(-4)}`
                  : phantomWalletInstalled
                  ? "Connect Wallet"
                  : "Install Phantom"}
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
        <div className="mb-16 perspective-1000">
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
            {topTraders.map((trader, i) => (
              <Card
                key={i}
                className={cn(
                  "border-[#2A2D3A]/50 relative overflow-hidden w-full md:w-[300px]",
                  "transition-all duration-500 ease-out",
                  trader.position === "center"
                    ? "z-20 md:w-[340px] transform scale-[1.03] -translate-y-1 translate-z-[30px] bg-[#0F1115] hover:scale-[1.05] hover:translate-z-[40px]"
                    : "z-10 transform scale-95 translate-y-0 translate-z-[-10px] opacity-90 hover:opacity-100 hover:scale-100 hover:translate-z-0 bg-[#0D0E12]",
                  "shadow-xl hover:shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20"
                )}
              >
                {trader.position === "left" && <Badge type="silver" />}
                {trader.position === "center" && <Badge type="gold" />}
                {trader.position === "right" && <Badge type="bronze" />}
                <div className="p-6 pt-8 relative">
                  <div className="flex flex-col items-center text-center mb-6 relative z-10">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold relative overflow-hidden">
                        {trader.name[0]}
                        <div className="absolute inset-0 bg-purple-500 opacity-30 animate-pulse"></div>
                      </div>
                      <SocialLinks />
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-white">
                      {trader.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {trader.walletAddress}
                    </p>
                    <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-1 flex items-center">
                      <TrendingUp className="mr-2 h-6 w-6 text-emerald-500" />
                      {trader.pnl} ≋
                    </div>
                    <p className="text-gray-300">{trader.value}</p>
                  </div>
                  <div className="w-full h-px bg-[#2A2D3A]/50 mb-6 relative">
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-green-500/10 to-transparent"></div>
                  </div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-sm text-gray-300">
                        {trader.greenTrades} Wins
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                      <span className="text-sm text-gray-300">
                        {trader.redTrades} Losses
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#2A2D3A]/50 rounded-full overflow-hidden relative z-10">
                    {(() => {
                      const { greenPercentage, redPercentage } =
                        calculateTradePercentages(
                          trader.greenTrades,
                          trader.redTrades
                        );
                      return (
                        <>
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600"
                            style={{ width: `${greenPercentage}%` }}
                          />
                          <div
                            className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-400 to-red-600"
                            style={{ width: `${redPercentage}%` }}
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
                {trader.position === "center" && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_-20%,#7928CA,#FF0080)]"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* List View */}
        <div className="space-y-4">
          {rankedTraders.map((trader, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-[#1E2028] to-[#14151A] border border-[#2A2D3A]/50 rounded-lg p-4 flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50"
            >
              <div className="flex items-center gap-4 w-[50%]">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold relative overflow-hidden">
                    {trader.name[0]}
                    <div className="absolute inset-0 bg-purple-500 opacity-30 animate-pulse"></div>
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#2A2D3A] rounded-full flex items-center justify-center text-xs font-bold text-white border border-purple-500">
                    {trader.rank}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{trader.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                      {trader.walletAddress}
                    </p>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-[#2A2D3A]/50 rounded-full flex items-center justify-center transition-colors hover:bg-[#2A2D3A]">
                        <Twitter className="w-3 h-3 text-gray-300" />
                      </div>
                      <div className="w-6 h-6 bg-[#2A2D3A]/50 rounded-full flex items-center justify-center transition-colors hover:bg-[#2A2D3A]">
                        <MessageCircle className="w-3 h-3 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-px h-12 bg-[#2A2D3A]/50 mx-4" />
              <div className="flex flex-col items-center gap-2 w-[25%]">
                <div className="w-full h-2 bg-[#2A2D3A]/50 rounded-full overflow-hidden relative">
                  {(() => {
                    const { greenPercentage, redPercentage } =
                      calculateTradePercentages(
                        trader.greenTrades,
                        trader.redTrades
                      );
                    return (
                      <>
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${greenPercentage}%` }}
                        />
                        <div
                          className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-400 to-red-600"
                          style={{ width: `${redPercentage}%` }}
                        />
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between w-full text-xs text-gray-400">
                  <span>{trader.greenTrades} Wins</span>
                  <span>{trader.redTrades} Losses</span>
                </div>
              </div>
              <div className="w-px h-12 bg-[#2A2D3A]/50 mx-4" />
              <div className="w-[25%] text-right">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-end">
                  <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
                  {trader.pnl} ≋
                </div>
                <div className="text-gray-300 text-sm">{trader.value}</div>
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