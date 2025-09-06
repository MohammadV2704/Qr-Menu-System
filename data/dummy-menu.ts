import type { MenuData } from "@/lib/types"

const data: MenuData = {
  restaurantId: "demo-restaurant",
  restaurantName: "Demo Bistro",
  categories: [
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Mains" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
  ],
  items: [
    {
      id: "bruschetta",
      categoryId: "starters",
      name: "Bruschetta",
      description: "Grilled bread with tomatoes, garlic, and basil.",
      price: 7.5,
      popular: true,
      veg: true,
      image: "/bruschetta-appetizer-photo.png",
    },
    {
      id: "caesar-salad",
      categoryId: "starters",
      name: "Caesar Salad",
      description: "Crisp romaine with Caesar dressing and croutons.",
      price: 8.25,
      image: "/caesar-salad-photo.png",
    },
    {
      id: "margherita",
      categoryId: "mains",
      name: "Margherita Pizza",
      description: "Tomato, mozzarella, fresh basil.",
      price: 14.0,
      popular: true,
      veg: true,
      image: "/margherita-pizza-photo.png",
    },
    {
      id: "steak-frites",
      categoryId: "mains",
      name: "Steak Frites",
      description: "Grilled sirloin with crispy fries.",
      price: 22.0,
      image: "/grilled-salmon-dish-photo.png",
    },
    {
      id: "tiramisu",
      categoryId: "desserts",
      name: "Tiramisu",
      description: "Mascarpone and espresso-soaked ladyfingers.",
      price: 6.5,
      veg: true,
      image: "/tiramisu-dessert-photo.png",
    },
    {
      id: "espresso",
      categoryId: "drinks",
      name: "Espresso",
      description: "Rich, aromatic shot.",
      price: 3.0,
      veg: true,
      image: "/lemonade-drink-photo.png",
    },
  ],
}

export default data

export const menus: Record<string, MenuData> = {
  [data.restaurantId]: data,
}
