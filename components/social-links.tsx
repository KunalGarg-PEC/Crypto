import { Twitter, MessageCircle } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center -space-x-1 absolute -bottom-1 left-1/2 -translate-x-1/2">
      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center -translate-x-4 border border-[#0F1115]">
        <Twitter className="w-3 h-3 text-gray-400" />
      </div>
      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center translate-x-4 border border-[#0F1115]">
        <MessageCircle className="w-3 h-3 text-gray-400" />
      </div>
    </div>
  )
}

