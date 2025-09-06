"use client"

import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/format"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentOptions, type PaymentMethod } from "@/components/checkout/payment-options"

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart()
  const [name, setName] = useState("")
  const [table, setTable] = useState("")
  const [payment, setPayment] = useState<PaymentMethod>("upi")
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onPlaceOrder() {
    if (items.length === 0 || placing) return
    setPlacing(true)
    setError(null)
    try {
      const lines = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: Math.round(i.price * 100),
        qty: i.quantity,
      }))
      const totalCents = lines.reduce((sum, l) => sum + l.price * l.qty, 0)

      let paymentId: string | undefined
      if (payment === "card" || payment === "upi") {
        const payRes = await fetch("/api/payments/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amountCents: totalCents, method: payment }),
        })
        const payJson = await payRes.json().catch(() => ({}))
        if (!payRes.ok || !payJson?.ok) {
          setError(payJson?.message || "Payment failed. Please try again.")
          setPlacing(false)
          return
        }
        paymentId = payJson.id
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: "demo-restaurant",
          items: lines,
          total: totalCents,
          paymentMethod: payment,
          paymentId,
          customerName: name || "Guest",
          table: table || "1",
        }),
      })
      if (!res.ok) throw new Error("Failed to place order")
      const { id } = await res.json()
      clear()
      router.push(`/orders/${id}`)
    } catch (e) {
      console.error("[v0] place order failed:", e)
      setError("Could not place order. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  const isOnline = payment === "card" || payment === "upi"

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
      <p className="mt-1 text-sm text-gray-600">Review your order and add details.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-base font-medium text-gray-900">Order Summary</h2>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span className="text-gray-700">{formatCurrency(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-base font-medium text-gray-900">Details</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Customer name</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700">Table</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>

            <PaymentOptions value={payment} onChange={setPayment} />

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <button
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={placing || items.length === 0}
              onClick={onPlaceOrder}
            >
              {placing ? "Processing..." : isOnline ? "Pay & Place Order" : "Place Order"}
            </button>
            <p className="text-xs text-gray-500">
              Online payments (UPI/Card) simulate a secure gateway for demo. If a payment fails, you can retry.
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <p className="mt-2 text-xs text-gray-500">
          Your cart is empty. Add items from the menu to see payment options here.
        </p>
      )}
    </section>
  )
}
