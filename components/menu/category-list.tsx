"use client"
type Props = {
  categories: { id: string; name: string }[]
  activeId?: string
  onChange: (id?: string) => void
}

export function CategoryList({ categories, activeId, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`rounded-full border px-3 py-1.5 text-sm ${
          activeId === undefined ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"
        }`}
        onClick={() => onChange(undefined)}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          className={`rounded-full border px-3 py-1.5 text-sm ${
            activeId === c.id ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"
          }`}
          onClick={() => onChange(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
