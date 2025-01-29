import type React from "react"

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="loader w-full h-full flex flex-wrap items-center justify-center gap-2.5 transition-all duration-500 ease-linear my-4">
      <div className="ball w-4 h-4 bg-black rounded-full animate-bounce6135" style={{ animationDelay: "0s" }}></div>
      <div className="ball w-4 h-4 bg-black rounded-full animate-bounce6135" style={{ animationDelay: "0.25s" }}></div>
      <div className="ball w-4 h-4 bg-black rounded-full animate-bounce6135" style={{ animationDelay: "0.5s" }}></div>
    </div>
  )
}