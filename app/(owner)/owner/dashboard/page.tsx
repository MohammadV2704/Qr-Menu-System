export default function OwnerDashboardPage() {
  const metrics = [
    { label: "Total Orders", value: 128 },
    { label: "Pending", value: 6 },
    { label: "Preparing", value: 4 },
    { label: "Delivered", value: 112 },
  ]
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border bg-white p-4">
            <div className="text-sm text-gray-600">{m.label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border bg-white p-6">
        <p className="text-sm text-gray-700">
          Quick links: Manage your menu, view incoming orders, or generate table QR codes.
        </p>
      </div>
    </section>
  )
}
