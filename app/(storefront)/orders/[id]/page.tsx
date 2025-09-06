"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/format"

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "canceled"

interface OrderDto {
  id: string
  restaurant: string
  total: number // cents/paise
  status: OrderStatus
  paymentMethod: "upi" | "card" | "cash"
}

export default function OrderTrackerPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const search = useSearchParams()
  const demoQuery = search.get("demo") === "1" // existing query toggle
  const [order, setOrder] = useState<OrderDto | null>(null)
  const [showDemo, setShowDemo] = useState(false) // local demo toggle

  useEffect(() => {
    let es: EventSource | null = null
    let poll: any = null

    async function fetchLatest() {
      try {
        const res = await fetch(`/api/orders/${id}`, { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as OrderDto
        setOrder((prev) => {
          if (!prev) return data
          return prev.status !== data.status ? { ...prev, status: data.status } : prev
        })
      } catch {}
    }

    async function init() {
      await fetchLatest()
      es = new EventSource(`/api/orders/${id}/events`)
      es.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data)
          if (payload?.type === "order-status" && payload?.id === id) {
            setOrder((prev) => (prev ? { ...prev, status: payload.status } : prev))
          }
        } catch {}
      }
      es.onerror = () => {
        if (!poll) poll = setInterval(fetchLatest, 3000)
      }
      if (!poll) poll = setInterval(fetchLatest, 10000)
    }

    init()
    return () => {
      es?.close()
      if (poll) clearInterval(poll)
    }
  }, [id])

  async function setStatus(next: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) return
      // optimistic UI; SSE will confirm
      setOrder((prev) => (prev ? { ...prev, status: next } : prev))
    } catch {}
  }

  if (!order) return <main className="p-4">Loading order...</main>

  const steps: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed"]

  return (
    <main className="container mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-pretty">Order #{order.id.slice(0, 6)}</h1>
      <div className="rounded-lg border bg-white p-4">
        <p className="mb-2 text-sm text-gray-700">
          Payment: {order.paymentMethod === "upi" ? "UPI" : order.paymentMethod === "card" ? "Card" : "Pay at counter"}
        </p>
        <ol className="grid grid-cols-5 gap-2 text-sm">
          {steps.map((s) => (
            <li
              key={s}
              className={`rounded border px-2 py-1 text-center ${
                steps.indexOf(s) <= steps.indexOf(order.status)
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "text-gray-500"
              }`}
            >
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-600">Total: {formatCurrency(order.total / 100)}</p>

        {/* Staff guidance */}
        <p className="mt-4 text-xs text-gray-500">
          Status is updated by staff on the Owner screen. Open <code className="font-mono">/owner/orders</code> to
          advance Pending → Confirmed → Preparing → Ready → Completed.
        </p>

        {!demoQuery && !showDemo && (
          <div className="mt-3">
            <button
              onClick={() => setShowDemo(true)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Enable demo controls
            </button>
            <span className="ml-2 align-middle text-xs text-gray-500">
              For quick testing on this page (no staff screen needed)
            </span>
          </div>
        )}

        {(demoQuery || showDemo) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {steps.map((s) => (
              <button
                key={s}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  s === order.status ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                }`}
                onClick={() => setStatus(s)}
              >
                Set {s}
              </button>
            ))}
            <button
              className="rounded-md border px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              onClick={() => setStatus("canceled")}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
