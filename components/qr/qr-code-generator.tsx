"use client"
import { useEffect, useMemo, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

type Props = {
  restaurantIdDefault?: string
}

export function QRCodeGenerator({ restaurantIdDefault = "demo-restaurant" }: Props) {
  const [restaurantId, setRestaurantId] = useState(restaurantIdDefault)
  const [tables, setTables] = useState(5)
  const [baseUrl, setBaseUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") setBaseUrl(window.location.origin)
  }, [])

  const urls = useMemo(() => {
    return Array.from({ length: Math.max(1, tables) }).map((_, i) => {
      const table = String(i + 1)
      return `${baseUrl}/menu/${restaurantId}?table=${table}`
    })
  }, [baseUrl, restaurantId, tables])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          Restaurant ID
          <input
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="rounded-md border px-3 py-2"
            placeholder="demo-restaurant"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tables
          <input
            type="number"
            min={1}
            value={tables}
            onChange={(e) => setTables(Number.parseInt(e.target.value || "1"))}
            className="rounded-md border px-3 py-2"
          />
        </label>
        <div className="flex flex-col gap-1 text-sm">
          Base URL
          <input value={baseUrl} readOnly className="rounded-md border bg-gray-50 px-3 py-2 text-gray-600" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {urls.map((url, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4">
            <div className="text-sm font-medium text-gray-900">Table {idx + 1}</div>
            <div className="mt-2 flex items-center justify-center">
              <QRCodeCanvas value={url} size={160} includeMargin />
            </div>
            <div className="mt-2 break-all text-xs text-gray-600">{url}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
