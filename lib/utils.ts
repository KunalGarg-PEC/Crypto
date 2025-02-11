import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTradePercentages(greenTrades: number, redTrades: number) {
  const total = greenTrades + redTrades
  const greenPercentage = (greenTrades / total) * 100
  const redPercentage = (redTrades / total) * 100
  return { greenPercentage, redPercentage }
}

