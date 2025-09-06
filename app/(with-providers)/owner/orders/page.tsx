"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Order, OrderStatus } from "@/lib/types"
import { formatCurrency } from "@/lib/format"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

const ORDERS_KEY = "qrmenu_orders_v1"

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const params = useSearchParams()
  const placed = params.get("placed")

  useEffect(() => {
    const raw = localStorage.getItem(ORDERS_KEY)
    setOrders(raw ? JSON.parse(raw) : [])
  }, [])

  const filtered = useMemo(
    () => (status === "all" ? orders : orders.filter((o) => o.status === status)),
    [orders, status],
  )

  const updateStatus = (id: string, next: OrderStatus) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: next } : o))
    setOrders(updated)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            {placed && <p className="text-sm text-green-700">Order placed. It appears here.</p>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Status</label>
            <select
              className="rounded-md border bg-white px-2 py-1.5 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-4">
          {filtered.map((o) => (
            <li key={o.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">#{o.id}</span> • Table {o.tableId} •{" "}
                    {new Date(o.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">Items: {o.items.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-base font-semibold text-gray-900">{formatCurrency(o.total)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={o.status} />
                <div className="flex gap-2">
                  {o.status !== "preparing" && (
                    <button
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => updateStatus(o.id, "preparing")}
                    >
                      Mark Preparing
                    </button>
                  )}
                  {o.status !== "ready" && (
                    <button
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => updateStatus(o.id, "ready")}
                    >
                      Mark Ready
                    </button>
                  )}
                  {o.status !== "delivered" && (
                    <button
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                      onClick={() => updateStatus(o.id, "delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && <p className="mt-6 text-sm text-gray-600">No orders.</p>}
      </section>
      <Footer />
    </main>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-gray-100 text-gray-800",
    delivered: "bg-green-100 text-green-800",
  }
  return <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}>{status}</span>
}
