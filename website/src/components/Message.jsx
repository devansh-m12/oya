import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { cls } from "./utils"

export default function Message({ role, content, toolLogs, children }) {
  const isUser = role === "user"
  const hasToolLogs = role === "assistant" && toolLogs && toolLogs.length > 0
  const [activeTab, setActiveTab] = useState(hasToolLogs ? "response" : null)

  const showTabs = hasToolLogs

  const renderContent = () => {
    if (showTabs) {
      return (
        <div className="space-y-2">
          <div className="flex border-b border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("response")}
              className={cls(
                "px-4 py-2 text-sm font-medium",
                activeTab === "response"
                  ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              Response
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={cls(
                "px-4 py-2 text-sm font-medium",
                activeTab === "tools"
                  ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              Tools ({toolLogs.length})
            </button>
          </div>
          <div className={activeTab === "response" ? "block" : "hidden"}>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
          <div className={activeTab === "tools" ? "block" : "hidden"}>
            <div className="space-y-4">
              {toolLogs.map((log, index) => (
                <div key={index} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{log.name}</h4>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <strong>Arguments:</strong> {JSON.stringify(log.arguments, null, 2)}
                  </div>
                  <div className="mt-2">
                    <strong>Result:</strong>
                    <pre className="mt-1 rounded bg-zinc-50 p-2 text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {log.result}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    return isUser ? (
      <div className="whitespace-pre-wrap">{content}</div>
    ) : (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className={cls("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
          AI
        </div>
      )}
      <div
        className={cls(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          isUser
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800",
        )}
      >
        {renderContent()}
        {children}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
          JD
        </div>
      )}
    </div>
  )
}
