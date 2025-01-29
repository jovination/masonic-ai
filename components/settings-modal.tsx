"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings, Trash2, ClipboardPaste } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

export function SettingsModal() {
  const [apiKey, setApiKey] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem("huggingface-api-key")
    if (savedKey) setApiKey(savedKey)
  }, [])

  const handleSave = () => {
    if (apiKey.trim().length > 0) {
      localStorage.setItem("huggingface-api-key", apiKey)
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        setIsOpen(false)
      }, 1500)
    }
  }

  const handleDelete = () => {
    localStorage.removeItem("huggingface-api-key")
    setApiKey("")
    toast({
      title: "API Key Deleted",
      description: "Your Hugging Face API key has been removed.",
    })
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setApiKey(text)
      toast({
        title: "API Key Pasted",
        description: "The API key has been pasted from your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard. Please try manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your Hugging Face API key to enable code generation.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 px-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hugging Face API Key</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-grow rounded-full"
              />
              <Button onClick={handlePaste} variant="outline" className="rounded-full">
                <ClipboardPaste className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          {showAlert && (
            <Alert className="bg-green-50 text-green-800 border-green-200 rounded-2xl">
              <AlertDescription>API key saved successfully!</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-grow rounded-full" disabled={!apiKey.trim()}>
              Save Settings
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="rounded-full" disabled={!apiKey.trim()}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

