"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Twitter, MessageCircle, Send, User, X, Wallet, Twitch, Tv } from "lucide-react"
import type React from "react"

interface SocialPlatform {
  name: string
  icon: React.ReactNode
  placeholder: string
  color: string
}

interface AddSocialsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (nickname: string, walletAddress: string, socials: Record<string, string>) => void
  initialSocials: Record<string, string>
  walletAddress: string | null
  initialNickname: string
}

export function SocialMediaModal({
  isOpen,
  onClose,
  onSubmit,
  initialSocials,
  walletAddress,
  initialNickname,
}: AddSocialsModalProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [manualWalletAddress, setManualWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [socials, setSocials] = useState<Record<string, string>>({
    telegram: "",
    twitter: "",
    discord: "",
    twitch: "",
    kick: "",
  })

  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname)
      setSocials(initialSocials)
      setManualWalletAddress("")
    }
  }, [isOpen])

  const platforms: SocialPlatform[] = [
    {
      name: "telegram",
      icon: <Send className="w-4 h-4" />,
      placeholder: "Telegram username",
      color: "#0088cc",
    },
    {
      name: "twitter",
      icon: <Twitter className="w-4 h-4" />,
      placeholder: "Twitter username",
      color: "#1DA1F2",
    },
    {
      name: "discord",
      icon: <MessageCircle className="w-4 h-4" />,
      placeholder: "Discord userid",
      color: "#5865F2",
    },
    {
      name: "twitch",
      icon: <Twitch className="w-4 h-4" />,
      placeholder: "Twitch username",
      color: "#9146FF",
    },
    {
      name: "kick",
      icon: <Tv className="w-4 h-4" />,
      placeholder: "Kick username",
      color: "#53FC18",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const effectiveWalletAddress = walletAddress || manualWalletAddress

    if (!effectiveWalletAddress) {
      alert("Please enter a wallet address")
      return
    }

    if (!nickname) {
      alert("Please enter a nickname")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(nickname, effectiveWalletAddress, socials)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to save social information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (platform: string, value: string) => {
    setSocials((prev) => ({
      ...prev,
      [platform]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] p-0 bg-[#0a0b0d] border border-[#2a2b2e] rounded-2xl overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Add Social Accounts</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#1a1b1d] rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Wallet className="h-4 w-4 text-gray-400" />
              </div>
              {walletAddress ? (
                <Input
                  value={walletAddress}
                  readOnly
                  className="pl-8 w-full bg-[#1a1b1d] border-[#2a2b2e] text-white placeholder-gray-500 focus:ring-1 focus:ring-[#3a3b3e] focus:border-transparent rounded-lg text-sm h-9"
                />
              ) : (
                <Input
                  value={manualWalletAddress}
                  onChange={(e) => setManualWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="pl-8 w-full bg-[#1a1b1d] border-[#2a2b2e] text-white placeholder-gray-500 focus:ring-1 focus:ring-[#3a3b3e] focus:border-transparent rounded-lg text-sm h-9"
                />
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname"
                required
                className="pl-8 w-full bg-[#1a1b1d] border-[#2a2b2e] text-white placeholder-gray-500 focus:ring-1 focus:ring-[#3a3b3e] focus:border-transparent rounded-lg text-sm h-9"
              />
            </div>

            {platforms.map((platform) => (
              <div key={platform.name} className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <div style={{ color: platform.color }}>{platform.icon}</div>
                </div>
                <Input
                  id={platform.name}
                  value={socials[platform.name]}
                  onChange={(e) => handleInputChange(platform.name, e.target.value)}
                  placeholder={platform.placeholder}
                  className="pl-8 w-full bg-[#1a1b1d] border-[#2a2b2e] text-white placeholder-gray-500 focus:ring-1 focus:ring-[#3a3b3e] focus:border-transparent rounded-lg text-sm h-9"
                />
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg text-sm h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

