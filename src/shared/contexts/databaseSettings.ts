import type { Settings } from "@optolith/database-schema/gen"
import { createContext } from "react"

export const DatabaseSettingsContext = createContext<Settings>(null as unknown as Settings)
