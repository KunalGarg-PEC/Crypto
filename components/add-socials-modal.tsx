"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Command } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface AddSocialsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (socials: string[]) => void
  initialSocials: string[]
}

export function AddSocialsModal({ isOpen, onClose, onSubmit, initialSocials }: AddSocialsModalProps) {
  const [thoughts, setThoughts] = useState("")
  const currentDate = new Date()
  const formattedDate = currentDate
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit([thoughts])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} hideCloseButton>
      <DialogContent className="sm:max-w-[600px] p-0 bg-[#1C1D1F] border-0">
        <div className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <Select defaultValue="thoughts">
              <SelectTrigger className="w-[140px] border-0 bg-zinc-800/50 text-zinc-300 focus:ring-0">
                <SelectValue placeholder="Select type" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="thoughts">Thoughts</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-zinc-400 font-mono">{formattedDate}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Type your thoughts here..."
              className="min-h-[200px] bg-transparent border-0 text-zinc-300 text-lg placeholder:text-zinc-600 focus-visible:ring-0 resize-none p-0"
            />

            <div className="flex items-center justify-between">
              <span className="text-zinc-600 text-sm">+3 logs today</span>
              <div className="flex items-center gap-2">
                <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 rounded-lg">
                  Log
                  <div className="ml-2 flex items-center gap-1">
                    <Command className="h-3 w-3" />
                    <span className="text-xs">↵</span>
                  </div>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

