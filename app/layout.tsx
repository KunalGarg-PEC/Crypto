import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Crypto Leaderboard",
  description: "Track top traders and their performance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'