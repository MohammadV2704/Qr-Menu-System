"use client"

import { useMemo, useState } from "react"
import { menus } from "@/data/dummy-menu"
import type { MenuItem } from "@/lib/types"

export default function OwnerMenuPage() {
  const [restaurantId] = useState("demo-restaurant")
  const [items, setItems] = useState<MenuItem[]>(menus[restaurantId].items)
  const categories = menus[restaurantId].categories

  const [form, setForm] = useState<Partial<MenuItem>>({ name: "", price: 0, categoryId: categories[0].id })

  const addItem = () => {
    if (!form.name || !form.categoryId || !form.price) return
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: form.name!,
        description: form.description,
        price: Number(form.price),
        image: form.image || "/menu-item-photo.png",
        categoryId: form.categoryId!,
        tags: form.tags || [],
      },
    ])
    setForm({ name: "", price: 0, categoryId: categories[0].id })
  }

  const grouped = useMemo(() => {
    const byCat: Record<string, MenuItem[]> = {}
    for (const cat of categories) byCat[cat.id] = []
    for (const i of items) (byCat[i.categoryId] ||= []).push(i)
    return byCat
  }, [items, categories])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>

      <div className="rounded-lg border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <input
            type="number"
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Price"
            value={form.price ?? 0}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
          />
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addItem}
          >
            Add Item
          </button>
        </div>
      </div>

      {categories.map((c) => (
        <div key={c.id} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{c.name}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[c.id]?.map((i) => (
              <li key={i.id} className="rounded-lg border bg-white p-3">
                <div className="text-sm font-medium text-gray-900">{i.name}</div>
                <div className="text-xs text-gray-600">{i.description}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
