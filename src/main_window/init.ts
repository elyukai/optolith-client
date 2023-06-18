import { createAction } from "@reduxjs/toolkit"
import { ValidResults } from "optolith-database-schema"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"

export const init = createAction<{
  database: ValidResults
  globalSettings: GlobalSettings
}>("init")
