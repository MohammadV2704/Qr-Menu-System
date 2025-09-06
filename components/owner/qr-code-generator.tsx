"use client"

import { useMemo, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

export function QRCodeGenerator() {
  const [restaurant, setRestaurant] = useState("demo-restaurant")
  const [table, setTable] = useState("1")

  const url = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}/menu/${restaurant}?table=${encodeURIComponent(table)}`
  }, [restaurant, table])

  const download = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `qr-${restaurant}-table-${table}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Restaurant</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Table</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 text-center">
        <QRCodeCanvas id="qr-canvas" value={url} size={200} includeMargin />
        <p className="mt-2 break-all text-xs text-gray-600">{url}</p>
        <button onClick={download} className="mt-3 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
          Download PNG
        </button>
      </div>
    </div>
  )
}
