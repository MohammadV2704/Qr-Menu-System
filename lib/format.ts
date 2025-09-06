export const formatCurrency = (value: number, currency = "INR", locale = "en-IN") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)

export const sum = (items: { price: number; quantity: number }[]) =>
  items.reduce((acc, it) => acc + it.price * it.quantity, 0)
