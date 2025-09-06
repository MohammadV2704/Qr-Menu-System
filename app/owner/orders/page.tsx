"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { formatCurrency } from "@/lib/format"
import { useEffect, useMemo, useState } from "react"

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "canceled"

type OrderRow = {
  id: string
  restaurant: string
  total: number
  status: OrderStatus
  paymentMethod: "card" | "cash"
  createdAt: number
}

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [status, setStatus] = useState<OrderStatus | "all">("all")

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/orders", { cache: "no-store" })
      if (res.ok) setOrders(await res.json())
    }
    load()
    const es = new EventSource("/api/orders/events")
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        if (payload?.type === "order-created" && payload?.order?.id) {
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === payload.order.id)
            return exists ? prev : [payload.order as OrderRow, ...prev]
          })
          return
        }
        if (payload?.type === "order-status" && payload?.id) {
          setOrders((prev) => prev.map((o) => (o.id === payload.id ? { ...o, status: payload.status } : o)))
        }
      } catch {}
    }
    return () => es.close()
  }, [])

  const pending = useMemo(() => orders.filter((o) => o.status === "pending"), [orders])
  const preparing = useMemo(() => orders.filter((o) => o.status === "preparing"), [orders])

  const filtered = useMemo(
    () => (status === "all" ? orders : orders.filter((o) => o.status === status)),
    [orders, status],
  )

  async function updateStatus(id: string, next: OrderStatus) {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    if (!res.ok) return
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)))
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Status</label>
            <select
              className="rounded-md border bg-white px-2 py-1.5 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-medium text-gray-900">Pending</h2>
              <span className="text-xs text-gray-600">{pending.length}</span>
            </div>
            <ul className="divide-y">
              {pending.map((o) => (
                <OrderListRow key={o.id} o={o} onNext={updateStatus} />
              ))}
              {pending.length === 0 && <li className="px-4 py-3 text-sm text-gray-600">No pending orders.</li>}
            </ul>
          </div>
          <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-medium text-gray-900">Preparing</h2>
              <span className="text-xs text-gray-600">{preparing.length}</span>
            </div>
            <ul className="divide-y">
              {preparing.map((o) => (
                <OrderListRow key={o.id} o={o} onNext={updateStatus} />
              ))}
              {preparing.length === 0 && <li className="px-4 py-3 text-sm text-gray-600">No preparing orders.</li>}
            </ul>
          </div>
        </div>

        {/* Existing filter + full list */}
        <ul className="mt-6 grid grid-cols-1 gap-4">
          {filtered.map((o) => (
            <li key={o.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">#{o.id.slice(0, 6)}</span> •{" "}
                    {new Date(o.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">Payment: {o.paymentMethod === "card" ? "Card" : "Cash"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-base font-semibold text-gray-900">{formatCurrency((o.total ?? 0) / 100)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={o.status} />
                <div className="flex flex-wrap gap-2">
                  {o.status !== "confirmed" && (
                    <button
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => updateStatus(o.id, "confirmed")}
                    >
                      Mark Confirmed
                    </button>
                  )}
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
                  {o.status !== "completed" && (
                    <button
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                      onClick={() => updateStatus(o.id, "completed")}
                    >
                      Mark Completed
                    </button>
                  )}
                  {o.status !== "canceled" && (
                    <button
                      className="rounded-md border px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                      onClick={() => updateStatus(o.id, "canceled")}
                    >
                      Cancel
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

function OrderListRow({
  o,
  onNext,
}: {
  o: { id: string; createdAt: number; total: number; paymentMethod: "card" | "cash" }
  onNext: (id: string, next: OrderStatus) => Promise<void>
}) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">#{o.id.slice(0, 6)}</span> •{" "}
          {new Date(o.createdAt).toLocaleTimeString()}
          <span className="ml-2">· {o.paymentMethod === "card" ? "Card" : "Cash"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{formatCurrency((o.total ?? 0) / 100)}</span>
          <button
            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            onClick={() => onNext(o.id, "preparing")}
            title="Move to Preparing"
          >
            Prep
          </button>
          <button
            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            onClick={() => onNext(o.id, "ready")}
            title="Move to Ready"
          >
            Ready
          </button>
        </div>
      </div>
    </li>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-sky-100 text-sky-800",
    ready: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-gray-200 text-gray-700",
  }
  return <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}>{status}</span>
}
