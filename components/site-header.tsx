"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Zap } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="backdrop-blur-md bg-[#0A0B0F]/80 border-b border-[#1E2028]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="relative w-10 h-10 mr-3">

                  <Image src="/mightxlogo.png" alt="MightX Logo" layout="fill" className="rounded-lg" />

                  <div className="absolute inset-0 bg-blue-500 opacity-50 rounded-lg blur-sm"></div>
                </div>
                <span className="text-white text-xl font-bold">MightX</span>
              </div>
              <nav className="hidden md:flex items-center space-x-1">
                {["Trench", "Clan", "Leaderboard","Tracker"].map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2"
                  >
                    {item}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <div
                className={`relative transition-all duration-300 ease-in-out ${
                  isSearchFocused ? "w-64" : "w-48"
                }`}
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#1E2028]/50 text-white border-[#2A2D3A] focus:border-purple-500 pl-10 placeholder-gray-500 rounded-lg"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <Button
                variant="ghost"

            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2"

              >
                <span className="relative z-10 flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Connect Telegram
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button variant="ghost" className="text-white md:hidden">
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
