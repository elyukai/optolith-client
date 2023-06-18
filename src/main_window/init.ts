import { createAction } from "@reduxjs/toolkit"
import { ValidResults } from "optolith-database-schema"
import { GlobalSettings } from "../main/settingsWindow.ts"

export const init = createAction<{
  database: ValidResults
  globalSettings: GlobalSettings
}>("init")
