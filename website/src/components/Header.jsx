"use client"

import { Asterisk, MoreHorizontal, Menu, ChevronDown } from "lucide-react"

import { useState } from "react"

import GhostIconButton from "./GhostIconButton"

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen, persona, name, image }) {
  const [selectedBot, setSelectedBot] = useState("GPT-5")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const personas = [
    {
      name: "Casino Butler",
      image: "/butler.webp",
      path: "/butler",
      description: "Professional gambler guide"
    },
    {
      name: "Lara Pereona",
      image: "/lara.jpeg",
      path: "/lara",
      description: "Free spirit conversations"
    },
    {
      name: "Little Kozo",
      image: "/little_kozo.jpeg",
      path: "/little-kozo",
      description: "Playful little kozo companion"
    },
    // Add more personas as needed
  ];

  const chatbots = [
    { name: "GPT-5", icon: "🤖" },
    { name: "Claude Sonnet 4", icon: "🎭" },
    { name: "Gemini", icon: "💎" },
    { name: "Assistant", icon: <Asterisk className="h-4 w-4" /> },
  ]

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {name ? (
        <div className="hidden md:flex relative items-center gap-3">
          <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover object-top" />
          <span className="text-xl font-semibold tracking-tight">{name}</span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="ml-2 inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
              {personas.map((p) => (
                <button
                  key={p.path}
                  onClick={() => {
                    window.open(p.path, '_blank');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
                >
                  <img src={p.image} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:flex relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            {typeof chatbots.find((bot) => bot.name === selectedBot)?.icon === "string" ? (
              <span className="text-sm">{chatbots.find((bot) => bot.name === selectedBot)?.icon}</span>
            ) : (
              chatbots.find((bot) => bot.name === selectedBot)?.icon
            )}
            {selectedBot}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
              {chatbots.map((bot) => (
                <button
                  key={bot.name}
                  onClick={() => {
                    setSelectedBot(bot.name)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
                >
                  {typeof bot.icon === "string" ? <span className="text-sm">{bot.icon}</span> : bot.icon}
                  {bot.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <GhostIconButton label="More">
          <MoreHorizontal className="h-4 w-4" />
        </GhostIconButton>
      </div>
    </div>
  )
}
