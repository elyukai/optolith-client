import { remote } from "electron"
import * as CheckForUpdates from "./CheckForUpdates"

export const isUpdaterEnabled = () => CheckForUpdates.isUpdaterEnabled (remote.app)
