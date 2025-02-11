interface BadgeProps {
  type: "gold" | "silver" | "bronze"
}

export function Badge({ type }: BadgeProps) {
  const colors = {
    gold: "bg-gradient-to-b from-yellow-300 to-yellow-600",
    silver: "bg-gradient-to-b from-gray-300 to-gray-500",
    bronze: "bg-gradient-to-b from-orange-300 to-orange-700",
  }

  const icons = {
    gold: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 .6-1.7 1.8-1.7 3s.7 2.4 1.7 3c-.3 1.2 0 2.5 1 3.4.8.8 2.1 1.2 3.3 1 .6 1 1.8 1.6 3 1.6s2.4-.6 3-1.7c1.2.3 2.5 0 3.4-1 .8-.8 1.2-2 1-3.3 1-.6 1.7-1.8 1.7-3s-.7-2.4-1.7-3c.3-1.2 0-2.5-1-3.4a3.7 3.7 0 0 0-3.3-1c-.6-1-1.8-1.6-3-1.6z"/><path d="M12 8v4M12 16h.01"/></svg>`,
    silver: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    bronze: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  }

  return (
    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30">
      <div
        className={`w-14 h-14 rounded-full ${colors[type]} shadow-lg flex items-center justify-center p-2 border-4 border-[#0F1115]`}
      >
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          dangerouslySetInnerHTML={{ __html: icons[type] }}
        />
      </div>
    </div>
  )
}

