import type { Cache } from "@optolith/database-schema/cache"
import { createAction } from "@reduxjs/toolkit"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"

/**
 * Action to initialize the main window with required values.
 */
export const init = createAction<{
  database: [string, { id: string; content: object }[]][]
  cache: Cache
  globalSettings: GlobalSettings
}>("init")
