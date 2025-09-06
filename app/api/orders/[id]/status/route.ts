import { updateOrderStatus } from "@/lib/store/orders"
import { emit } from "@/lib/realtime-bus"

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const { status } = await req.json()
  const updated = updateOrderStatus(ctx.params.id, status)
  if (!updated) return new Response("Not found", { status: 404 })
  console.log("[v0] order-status PATCH ->", ctx.params.id, status)
  emit({ type: "order-status", id: updated.id, status: updated.status })
  return Response.json({ ok: true })
}
