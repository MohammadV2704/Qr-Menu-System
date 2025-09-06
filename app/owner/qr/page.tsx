import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { QRCodeGenerator } from "@/components/owner/qr-code-generator"

export default function OwnerQRPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">QR Code Generator</h1>
        <p className="text-sm text-gray-600">Generate table-specific QR codes.</p>
        <div className="mt-6">
          <QRCodeGenerator />
        </div>
      </section>
      <Footer />
    </main>
  )
}
