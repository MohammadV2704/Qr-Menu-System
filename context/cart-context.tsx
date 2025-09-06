"use client"
import React from "react"
import type { CartItem } from "@/lib/types"
import { sum } from "@/lib/format"

type CartContextType = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  init: (restaurantId?: string, table?: string) => void
}

const CartContext = React.createContext<CartContextType | null>(null)
const STORAGE_KEY = "qrmenu_cart_v1"

type State = { items: CartItem[] }
type Action =
  | { type: "INIT"; payload: CartItem[] }
  | { type: "ADD"; payload: { item: Omit<CartItem, "quantity">; qty: number } }
  | { type: "INC"; payload: string }
  | { type: "DEC"; payload: string }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { items: action.payload }
    case "ADD": {
      const { item, qty } = action.payload
      const exists = state.items.find((i) => i.id === item.id)
      const items = exists
        ? state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i))
        : [...state.items, { ...item, quantity: qty }]
      return { items }
    }
    case "INC":
      return { items: state.items.map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i)) }
    case "DEC":
      return {
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload) }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { items: [] })
  const metaRef = React.useRef<{ restaurantId?: string; table?: string }>({}) // keep lightweight meta

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: "INIT", payload: JSON.parse(raw) })
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) =>
    dispatch({ type: "ADD", payload: { item, qty: quantity } })
  const increment = (id: string) => dispatch({ type: "INC", payload: id })
  const decrement = (id: string) => dispatch({ type: "DEC", payload: id })
  const remove = (id: string) => dispatch({ type: "REMOVE", payload: id })
  const clear = () => dispatch({ type: "CLEAR" })
  const init = (restaurantId?: string, table?: string) => {
    metaRef.current = { restaurantId, table }
  }

  const totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = sum(state.items)

  const value: CartContextType = {
    items: state.items,
    totalQuantity,
    totalPrice,
    addItem,
    increment,
    decrement,
    remove,
    clear,
    init, // expose init in context
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
