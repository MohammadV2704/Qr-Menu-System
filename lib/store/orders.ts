export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "canceled"
export type PaymentMethod = "card" | "cash" | "upi"

export interface OrderItem {
  id: string
  name: string
  price: number
  qty: number
}

export interface OrderRecord {
  id: string
  restaurant: string
  items: OrderItem[]
  total: number
  paymentMethod: PaymentMethod
  paymentId?: string
  status: OrderStatus
  createdAt: number
  updatedAt: number
}

const orders = new Map<string, OrderRecord>()

export function createOrder(data: Omit<OrderRecord, "id" | "status" | "createdAt" | "updatedAt">): OrderRecord {
  const id = crypto.randomUUID()
  const now = Date.now()
  const initialStatus: OrderStatus = "pending"
  const rec: OrderRecord = { id, status: initialStatus, createdAt: now, updatedAt: now, ...data }
  orders.set(id, rec)
  return rec
}

export function getOrder(id: string): OrderRecord | undefined {
  return orders.get(id)
}

export function listOrders(): OrderRecord[] {
  return Array.from(orders.values()).sort((a, b) => b.createdAt - a.createdAt)
}

export function updateOrderStatus(id: string, status: OrderStatus): OrderRecord | undefined {
  const rec = orders.get(id)
  if (!rec) return undefined
  rec.status = status
  rec.updatedAt = Date.now()
  orders.set(id, rec)
  return rec
}
