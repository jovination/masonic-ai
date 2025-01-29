import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json()
    const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 })
    }

    const response = await fetch("https://api-inference.huggingface.co/models/bigcode/starcoder", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API returned an error: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("An error occurred:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

