"use client"

import { useEffect, useState } from "react"

export type PaymentMethod = "upi" | "card" | "cash"

export function PaymentOptions({
  value = "upi",
  onChange,
}: {
  value?: PaymentMethod
  onChange: (method: PaymentMethod) => void
}) {
  const [method, setMethod] = useState<PaymentMethod>(value)

  useEffect(() => {
    setMethod(value)
  }, [value])

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">Payment method</p>
      <div className="grid gap-2" role="radiogroup" aria-label="Payment method">
        <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={method === "upi"}
            onChange={() => {
              setMethod("upi")
              onChange("upi")
            }}
            aria-checked={method === "upi"}
          />
          <span className="text-sm">
            UPI (GPay/PhonePe/Paytm)
            <span className="block text-xs text-gray-500">Secure UPI intent/payment (stubbed for demo).</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={method === "card"}
            onChange={() => {
              setMethod("card")
              onChange("card")
            }}
            aria-checked={method === "card"}
          />
          <span className="text-sm">
            Card (Stripe)
            <span className="block text-xs text-gray-500">Redirect to secure payment (stubbed for demo).</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={method === "cash"}
            onChange={() => {
              setMethod("cash")
              onChange("cash")
            }}
            aria-checked={method === "cash"}
          />
          <span className="text-sm">
            Pay at counter
            <span className="block text-xs text-gray-500">Pay when you pick up.</span>
          </span>
        </label>
      </div>
    </div>
  )
}
