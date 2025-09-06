import { QRCodeGenerator } from "@/components/qr/qr-code-generator"

export default function OwnerQRPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">QR Codes</h1>
      <p className="text-sm text-gray-600">Generate table-specific QR codes for your restaurant.</p>
      <QRCodeGenerator restaurantIdDefault="demo-restaurant" />
    </section>
  )
}
