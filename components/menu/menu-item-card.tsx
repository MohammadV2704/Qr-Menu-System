"use client"
import type { MenuItem } from "@/lib/types"
import { formatCurrency } from "@/lib/format"
import { useCart } from "@/context/cart-context"

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart()
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
      {item.image && (
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="h-40 w-full object-cover"
          width={320}
          height={160}
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
          {item.popular && (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Popular</span>
          )}
        </div>
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-blue-600">{formatCurrency(item.price)}</span>
          <button
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
