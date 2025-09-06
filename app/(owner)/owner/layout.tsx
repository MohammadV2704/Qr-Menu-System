import type React from "react"
import Link from "next/link"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-gray-900">
            QR Menu · Owner
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/owner/dashboard" className="text-sm text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/owner/menu" className="text-sm text-gray-700 hover:text-gray-900">
              Menu
            </Link>
            <Link href="/owner/orders" className="text-sm text-gray-700 hover:text-gray-900">
              Orders
            </Link>
            <Link href="/owner/qr" className="text-sm text-gray-700 hover:text-gray-900">
              QR Codes
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  )
}
