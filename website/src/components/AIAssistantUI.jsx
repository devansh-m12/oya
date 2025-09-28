"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, LayoutGrid, MoreHorizontal } from "lucide-react"
import Sidebar from "./sidebar"
import Header from "./Header"
import ChatPane from "./ChatPane"
import GhostIconButton from "./GhostIconButton"
import ThemeToggle from "./ThemeToggle"

export default function AIAssistantUI({ persona = 'general', name = '', image = '' }) {
  const [theme, setTheme] = useState("default")

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem("theme")
      if (saved) {
        setTheme(saved)
        return
      }
      const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      if (media && media.matches) {
        setTheme("dark")
      } else {
        setTheme("default")
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark")
      else document.documentElement.classList.remove("dark")
      document.documentElement.setAttribute("data-theme", theme)
      document.documentElement.style.colorScheme = theme
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    try {
      const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      if (!media) return
      const listener = (e) => {
        const saved = localStorage.getItem("theme")
        if (!saved) setTheme(e.matches ? "dark" : "default")
      }
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {}
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem("sidebar-collapsed")
      return raw ? JSON.parse(raw) : { pinned: true, recent: false, folders: true, templates: true }
    } catch {
      return { pinned: true, recent: false, folders: true, templates: true }
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    } catch {}
  }, [collapsed])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed-state")
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed-state", JSON.stringify(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  const [conversations, setConversations] = useState(() => {
    if (typeof window === "undefined") return []
    try {
      const key = `conversations_${persona}`;
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === "undefined") return null
    try {
      const key = `selectedId_${persona}`;
      const saved = localStorage.getItem(key)
      return saved ? saved : null
    } catch {
      return null
    }
  })
  const [templates, setTemplates] = useState(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem("templates")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [folders, setFolders] = useState(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem("folders")
      const parsed = saved ? JSON.parse(saved) : []
      if (parsed.length === 0) {
        const defaultFolders = [{ id: "f1", name: "Uncategorized" }]
        localStorage.setItem("folders", JSON.stringify(defaultFolders))
        return defaultFolders
      }
      return parsed
    } catch {
      const defaultFolders = [{ id: "f1", name: "Uncategorized" }]
      localStorage.setItem("folders", JSON.stringify(defaultFolders))
      return defaultFolders
    }
  })

  useEffect(() => {
    try {
      const key = `conversations_${persona}`;
      localStorage.setItem(key, JSON.stringify(conversations))
    } catch {}
  }, [conversations, persona])

  useEffect(() => {
    try {
      const key = `selectedId_${persona}`;
      if (selectedId) {
        localStorage.setItem(key, selectedId)
      } else {
        localStorage.removeItem(key)
      }
    } catch {}
  }, [selectedId, persona])

  useEffect(() => {
    try {
      localStorage.setItem("templates", JSON.stringify(templates))
    } catch {}
  }, [templates])

  useEffect(() => {
    try {
      localStorage.setItem("folders", JSON.stringify(folders))
    } catch {}
  }, [folders])

  const [query, setQuery] = useState("")
  const searchRef = useRef(null)

  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault()
        createNewChat()
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarOpen, conversations])

  useEffect(() => {
    if (conversations.length === 0) {
      createNewChat()
    } else if (!selectedId) {
      setSelectedId(conversations[0]?.id || null)
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
  }, [conversations, query])

  const pinned = filtered.filter((c) => c.pinned).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10)

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]))
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1
    return map
  }, [conversations, folders])

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: "Uncategorized",
      messages: [], // Ensure messages array is empty for new chats
    }
    setConversations((prev) => [item, ...prev])
    setSelectedId(id)
    setSidebarOpen(false)
  }

  function createFolder() {
    const name = prompt("Folder name")
    if (!name) return
    if (folders.some((f) => f.name.toLowerCase() === name.toLowerCase())) return alert("Folder already exists.")
    setFolders((prev) => [...prev, { id: Math.random().toString(36).slice(2), name }])
  }

  async function sendMessage(convId, content) {
    if (!content.trim()) return
    const now = new Date().toISOString()
    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content,
      createdAt: now
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = [...(c.messages || []), userMsg]
        return {
          ...c,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        }
      }),
    )

    setIsThinking(true)
    setThinkingConvId(convId)

    try {
      const conv = conversations.find(c => c.id === convId)
      const fullMessages = [...(conv?.messages || []), userMsg]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: fullMessages.map(m => ({ role: m.role, content: m.content })),
          persona
        }),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      const finalContent = data.response
      const toolLogs = data.toolLogs || []

      setIsThinking(false)
      setThinkingConvId(null)

      const asstMsg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: finalContent,
        toolLogs,
        createdAt: new Date().toISOString(),
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const msgs = [...c.messages, asstMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: finalContent.slice(0, 80),
          }
        }),
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setIsThinking(false)
      setThinkingConvId(null)
      // Optionally add an error message to the conversation
      const errorMsg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: "Sorry, there was an error processing your message. Please try again.",
        createdAt: new Date().toISOString(),
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const msgs = [...c.messages, errorMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: errorMsg.content.slice(0, 80),
          }
        }),
      )
    }
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msg = conv?.messages?.find((m) => m.id === messageId)
    if (!msg) return
    sendMessage(convId, msg.content)
  }

  function pauseThinking() {
    setIsThinking(false)
    setThinkingConvId(null)
  }

  function handleUseTemplate(template) {
    // This will be passed down to the Composer component
    // The Composer will handle inserting the template content
    if (composerRef.current) {
      composerRef.current.insertTemplate(template.content)
    }
  }

  const composerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId) || null

  return (
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        {name ? (
          <div className={`ml-1 flex items-center gap-2 text-${image ? "base" : "sm"} font-semibold tracking-tight`}>
            {image && <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover object-top" />}
            {name}
          </div>
        ) : (
          <div className="ml-1 flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="inline-flex h-4 w-4 items-center justify-center">✱</span> AI Assistant
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <GhostIconButton label="Schedule">
            <Calendar className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label="Apps">
            <LayoutGrid className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label="More">
            <MoreHorizontal className="h-4 w-4" />
          </GhostIconButton>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="mx-auto flex h-[calc(100vh-0px)] max-w-[1400px]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          conversations={conversations}
          pinned={pinned}
          recent={recent}
          folders={folders}
          folderCounts={folderCounts}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          togglePin={togglePin}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          createFolder={createFolder}
          createNewChat={createNewChat}
          templates={templates}
          setTemplates={setTemplates}
          onUseTemplate={handleUseTemplate}
        />

        <main className="relative flex min-w-0 flex-1 flex-col">
          <Header createNewChat={createNewChat} sidebarCollapsed={sidebarCollapsed} setSidebarOpen={setSidebarOpen} persona={persona} name={name} image={image} />
          <ChatPane
            ref={composerRef}
            conversation={selected}
            onSend={(content) => selected && sendMessage(selected.id, content)}
            onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
            onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
            isThinking={isThinking && thinkingConvId === selected?.id}
            onPauseThinking={pauseThinking}
            persona={persona}
          />
        </main>
      </div>
    </div>
  )
}
