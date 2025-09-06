"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { menus } from "@/data/dummy-menu"
import { CategoryList } from "@/components/menu/category-list"
import { MenuItemCard } from "@/components/menu/menu-item-card"
import { useCart } from "@/context/cart-context"

export default function RestaurantMenuPage() {
  const params = useParams<{ restaurant: string }>()
  const searchParams = useSearchParams()
  const table = searchParams.get("table") || undefined
  const restaurantId = params.restaurant || "demo-restaurant"
  const menu = menus[restaurantId] ?? menus["demo-restaurant"]

  const { init } = useCart()

  useEffect(() => {
    init(restaurantId, table)
  }, [init, restaurantId, table])

  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined)
  const [vegOnly, setVegOnly] = useState(false)

  const filtered = useMemo(() => {
    return menu.items.filter((i) => {
      if (activeCategory && i.categoryId !== activeCategory) return false
      if (vegOnly && !i.tags?.includes("veg")) return false
      if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [menu.items, activeCategory, vegOnly, query])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-600">
            {restaurantId} {table ? `· Table ${table}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm sm:w-64"
            placeholder="Search dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
            Veg only
          </label>
        </div>
      </div>

      <CategoryList categories={menu.categories} activeId={activeCategory} onChange={setActiveCategory} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
