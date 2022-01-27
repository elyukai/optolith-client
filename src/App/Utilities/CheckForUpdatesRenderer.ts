import * as remote from "@electron/remote"
import * as CheckForUpdates from "./CheckForUpdates"

export const isUpdaterEnabled = () => CheckForUpdates.isUpdaterEnabled (remote.app)
