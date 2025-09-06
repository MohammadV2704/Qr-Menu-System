import { getOrder } from "@/lib/store/orders"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const order = getOrder(ctx.params.id)
  if (!order) return new Response("Not found", { status: 404 })
  return Response.json(order)
}
