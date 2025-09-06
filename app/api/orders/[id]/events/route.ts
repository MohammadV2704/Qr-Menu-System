import { on } from "@/lib/realtime-bus"
import { getOrder } from "@/lib/store/orders"

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      function send(data: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Immediately send current status so UI reflects server state even before first event.
      try {
        const current = getOrder(id)
        if (current) {
          send({ type: "order-status", id, status: current.status })
        }
      } catch {}

      // Subscribe for future updates
      const off = on((evt) => {
        if (evt?.type === "order-status" && evt?.id === id) send(evt)
      })

      // Keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`:heartbeat\n\n`))
      }, 15000)

      // initial handshake
      send({ type: "connected", id })

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
