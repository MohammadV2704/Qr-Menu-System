"use client"

import { OrderCard } from "@/components/order/order-card"
import type { CartLine, Order } from "@/lib/types"
import { useMemo, useState } from "react"

const sampleLines: CartLine[] = [
  { item: { id: "margherita-pizza", name: "Margherita Pizza", price: 14.5, categoryId: "mains" }, quantity: 2 },
  { item: { id: "lemonade", name: "Fresh Lemonade", price: 4.5, categoryId: "drinks" }, quantity: 2 },
]

const initialOrders: Order[] = [
  {
    id: "1001",
    restaurantId: "demo-restaurant",
    table: "5",
    lines: sampleLines,
    total: sampleLines.reduce((s, l) => s + l.item.price * l.quantity, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "1002",
    restaurantId: "demo-restaurant",
    table: "2",
    lines: sampleLines.slice(0, 1),
    total: sampleLines.slice(0, 1).reduce((s, l) => s + l.item.price * l.quantity, 0),
    status: "preparing",
    createdAt: new Date().toISOString(),
  },
]

export default function OwnerOrdersPage() {
  const [orders] = useState<Order[]>(initialOrders)
  const counts = useMemo(() => {
    const map = { pending: 0, preparing: 0, ready: 0, delivered: 0, canceled: 0 }
    for (const o of orders) (map as any)[o.status]++
    return map
  }, [orders])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-white p-3">
            <div className="text-xs text-gray-600">{k.toUpperCase()}</div>
            <div className="text-xl font-semibold text-gray-900">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </section>
  )
}
