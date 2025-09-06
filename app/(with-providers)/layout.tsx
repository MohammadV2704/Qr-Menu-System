import type React from "react"
import { AppProviders } from "@/app/providers"

export default function WithProvidersLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}
