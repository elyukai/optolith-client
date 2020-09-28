import { app } from "electron"
import * as CheckForUpdates from "./CheckForUpdates"

export const isUpdaterEnabled = () => CheckForUpdates.isUpdaterEnabled (app)
