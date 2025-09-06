"use client"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/format"
import Link from "next/link"

export function CartSummary() {
  const { items, increment, decrement, remove, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link className="mt-3 inline-block text-sm text-blue-600 hover:underline" href="/menu/demo-restaurant">
          Browse menu
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y rounded-lg border bg-white">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{it.name}</p>
              <p className="text-sm text-gray-500">{formatCurrency(it.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded border text-gray-700 hover:bg-gray-50"
                aria-label="Decrease quantity"
                onClick={() => decrement(it.id)}
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{it.quantity}</span>
              <button
                className="h-8 w-8 rounded border text-gray-700 hover:bg-gray-50"
                aria-label="Increase quantity"
                onClick={() => increment(it.id)}
              >
                +
              </button>
              <button
                className="ml-2 rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => remove(it.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-base font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
      </div>
      <Link
        href="/checkout"
        className="block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}
