"use client"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-blue-600">
          QR Menu
        </Link>
        <nav className="flex items-center gap-4">
          <Link className="text-sm text-gray-600 hover:text-gray-900" href="/menu/demo-restaurant">
            Menu
          </Link>
          <Link className="text-sm text-gray-600 hover:text-gray-900" href="/owner/dashboard">
            Owner
          </Link>
          <Link className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50" href="/cart" aria-label="View cart">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  )
}
