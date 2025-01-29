import type React from "react"
import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text: string
  speed?: number
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <pre className="whitespace-pre-wrap font-mono text-sm">{displayedText}</pre>
}

