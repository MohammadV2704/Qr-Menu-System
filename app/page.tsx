import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-semibold text-gray-900">
            Simple, professional QR menu and ordering
          </h1>
          <p className="mt-3 text-pretty text-gray-600">
            Scan a table QR, browse the menu, add to cart, and place orders. Owners manage menus, orders, and QR codes.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/menu/demo-restaurant?table=5"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Demo Menu
            </Link>
            <Link
              href="/owner/dashboard"
              className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Owner Dashboard
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
