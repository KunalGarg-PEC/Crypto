"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabNavigation() {
  return (
    <div className="p-4 rounded-lg flex justify-start">
      <div className="bg-black rounded-lg inline-block">
        <Tabs defaultValue="daily">
          <TabsList className="inline-flex bg-transparent gap-4 justify-start pb-2 px-4">
            {["daily", "weekly", "monthly"].map((value) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-gray-900/50 data-[state=active]:text-white data-[state=active]:border-b-2 
                data-[state=active]:border-blue-400 px-4 py-2 text-base font-semibold text-gray-400 
                transition-colors duration-200 hover:text-blue-300 hover:bg-gray-800/30 rounded-lg
                relative group min-w-max"
              >
                <span className="relative z-10 capitalize">{value}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 scale-x-0 group-data-[state=active]:scale-x-100 
                transition-transform duration-300 ease-out" />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}