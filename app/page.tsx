"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code2, Send, Wand2, GitBranch, AlertCircle, Copy, Check } from "lucide-react"
import { SettingsModal } from "@/components/settings-modal"
import { toast } from "@/components/ui/use-toast"
import { LoadingAnimation } from "@/components/loading-animation"
import { TypingAnimation } from "@/components/typing-animation"

const QUICK_ACTIONS = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Generate Code",
    description: "AI-powered code generation",
  },
  {
    icon: <Wand2 className="w-5 h-5" />,
    title: "Refine Code",
    description: "Optimize existing code",
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Version Control",
    description: "Push to repository",
  },
]

export default function CodeGenerator() {
  const [hasApiKey, setHasApiKey] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: string; content: string; id: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = localStorage.getItem("huggingface-api-key")
    setHasApiKey(!!apiKey)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const apiKey = localStorage.getItem("huggingface-api-key")
    if (!apiKey) return

    setIsLoading(true)
    const userMessage = { role: "user", content: input, id: Date.now().toString() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: input,
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      const result = await response.json()
      const assistantMessage = {
        role: "assistant",
        content: result[0].generated_text,
        id: (Date.now() + 1).toString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An error occurred while generating the code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      toast({
        title: "Copied to clipboard",
        description: "The generated code has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium">Mason AI</span>
          </div>
          <SettingsModal />
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-semibold mb-3">Can I help you with anything?</h1>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Ready to assist you with anything you need, from answering questions to providing recommendations. Let's
              get started!
            </p>

            {!hasApiKey && (
              <div className="mb-8 p-4 bg-amber-50 rounded-2xl text-amber-800 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                Please add your Hugging Face API key in settings to enable code generation
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {QUICK_ACTIONS.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-gray-50 rounded-2xl border-2 transition-all duration-200 ease-in-out"
                  disabled={!hasApiKey}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 ease-in-out">
                    {action.icon}
                  </div>
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </Button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="pr-24 h-12 rounded-full transition-all duration-200 ease-in-out"
                disabled={!hasApiKey || isLoading}
              />
              <Button
                type="submit"
                className="absolute right-1.5 top-1.5 rounded-full px-4 transition-all duration-200 ease-in-out"
                disabled={!hasApiKey || isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </form>
          </div>

          <div className="px-8 pb-8">
            {messages.map((m) => (
              <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block max-w-[80%] p-4 ${
                    m.role === "user"
                      ? "bg-black text-white rounded-3xl rounded-tr-sm"
                      : "bg-gray-100 text-gray-900 rounded-3xl rounded-tl-sm"
                  } transition-all duration-300 ease-in-out`}
                >
                  {m.role === "user" ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm">{m.content}</pre>
                  ) : (
                    <TypingAnimation text={m.content} />
                  )}
                  {m.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 transition-all duration-200 ease-in-out"
                      onClick={() => copyToClipboard(m.content, m.id)}
                    >
                      {copiedId === m.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedId === m.id ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <LoadingAnimation />}
          </div>
        </Card>
      </div>
    </div>
  )
}

