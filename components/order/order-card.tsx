"use client"
import type { Order, OrderStatus } from "@/lib/types"
import { formatCurrency } from "@/lib/format"
import { useState } from "react"

const statuses: OrderStatus[] = ["pending", "preparing", "ready", "delivered", "canceled"]

export function OrderCard({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status)
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">Order #{order.id}</div>
        <select
          className="rounded-md border px-2 py-1 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Table {order.table || "-"} · {new Date(order.createdAt).toLocaleString()}
      </div>
      <ul className="mt-3 space-y-1">
        {order.lines.map((l) => (
          <li key={l.item.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-800">
              {l.quantity} × {l.item.name}
            </span>
            <span className="text-gray-900">{formatCurrency(l.item.price * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-sm text-gray-700">Total</span>
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</span>
      </div>
    </div>
  )
}
