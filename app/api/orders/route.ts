import type { NextRequest } from "next/server"
import { createOrder, listOrders } from "@/lib/store/orders"
import { emit } from "@/lib/realtime-bus"

export async function POST(req: NextRequest) {
  const { restaurant, items, total, paymentMethod, paymentId } = await req.json()
  const order = createOrder({
    restaurant,
    items,
    total,
    paymentMethod,
    paymentId,
  })

  emit({
    type: "order-created",
    order: {
      id: order.id,
      restaurant: order.restaurant,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    },
  })

  emit({ type: "order-status", id: order.id, status: order.status })
  return Response.json({ id: order.id })
}

export async function GET() {
  return Response.json(listOrders())
}
