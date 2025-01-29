export async function query(data: { inputs: string }) {
    const response = await fetch("https://api-inference.huggingface.co/models/bigcode/starcoder", {
      headers: {
        Authorization: "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxx",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
    const result = await response.json()
    return result
  }
  
  