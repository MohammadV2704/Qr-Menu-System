export type Category = {
  id: string
  name: string
}

export type MenuItem = {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image?: string
  popular?: boolean
  veg?: boolean
}

export type MenuData = {
  restaurantId: string
  restaurantName: string
  categories: Category[]
  items: MenuItem[]
}

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export type CartLine = {
  item: { id: string; name: string; price: number; categoryId?: string }
  quantity: number
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "canceled"

export type Order = {
  id: string
  restaurantId: string
  tableId?: string
  table?: string
  customerName?: string
  items?: CartItem[]
  lines?: CartLine[]
  total: number
  status: OrderStatus
  createdAt: string
}
