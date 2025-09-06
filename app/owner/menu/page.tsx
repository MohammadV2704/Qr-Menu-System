"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { MenuItem } from "@/lib/types"
import { useEffect, useState } from "react"

export default function OwnerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [desc, setDesc] = useState("")
  const [catId, setCatId] = useState("mains")

  useEffect(() => {
    // prefill with some dummy items
    setItems([
      {
        id: "margherita",
        categoryId: "mains",
        name: "Margherita Pizza",
        description: "Tomato, mozzarella, basil.",
        price: 14,
      },
    ])
  }, [])

  const addItem = () => {
    if (!name || price === "") return
    setItems((prev) => [
      ...prev,
      {
        id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        categoryId: catId,
        name,
        description: desc,
        price: Number(price),
      },
    ])
    setName("")
    setPrice("")
    setDesc("")
  }

  const delItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-3 text-base font-medium text-gray-900">Add Item</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-gray-700">Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Description</label>
                <textarea
                  className="min-h-20 w-full rounded-md border px-3 py-2 text-sm"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short description"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-sm text-gray-700">Price</label>
                  <input
                    type="number"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm text-gray-700">Category</label>
                  <select
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                  >
                    <option value="starters">Starters</option>
                    <option value="mains">Mains</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addItem}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-3 text-base font-medium text-gray-900">Items</h2>
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{i.name}</p>
                    <p className="text-xs text-gray-600">{i.description}</p>
                  </div>
                  <button
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={() => delItem(i.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
              {items.length === 0 && <p className="text-sm text-gray-600">No items yet.</p>}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
