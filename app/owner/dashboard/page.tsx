"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Order } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"

const ORDERS_KEY = "qrmenu_orders_v1"

export default function OwnerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(ORDERS_KEY)
    setOrders(raw ? JSON.parse(raw) : [])
  }, [])

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === "pending").length
    const preparing = orders.filter((o) => o.status === "preparing").length
    const delivered = orders.filter((o) => o.status === "delivered").length
    return { total, pending, preparing, delivered }
  }, [orders])

  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Owner Dashboard</h1>
        <p className="text-sm text-gray-600">Quick overview of orders and shortcuts.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Orders" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Preparing" value={stats.preparing} />
          <StatCard label="Delivered" value={stats.delivered} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/owner/menu" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Manage Menu
          </a>
          <a href="/owner/orders" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50">
            View Orders
          </a>
          <a href="/owner/qr" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Generate QR Codes
          </a>
        </div>
      </section>
      <Footer />
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
