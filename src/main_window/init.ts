import { createAction } from "@reduxjs/toolkit"
import type { Database } from "../database/index.ts"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"

/**
 * Action to initialize the main window with required values.
 */
export const init = createAction<{
  database: Database
  globalSettings: GlobalSettings
}>("init")
