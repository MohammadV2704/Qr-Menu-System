import { on } from "@/lib/realtime-bus"

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      function send(data: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }
      const off = on((evt) => {
        // forward any event; owner page can filter client-side
        send(evt)
      })

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`:heartbeat\n\n`))
      }, 15000)

      const signal = (req as any).signal as AbortSignal | undefined
      signal?.addEventListener("abort", () => {
        clearInterval(heartbeat)
        off()
        controller.close()
      })
    },
    cancel() {},
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
