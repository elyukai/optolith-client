import { ipcRenderer } from "electron"
import { GlobalSettings } from "./GlobalSettings.ts"

export type GlobalSettingsEmittingAPI = {
  setGlobalSetting: (keyValue: {
    [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
  }[keyof GlobalSettings]) => void
}

export const globalSettingsEmittingAPI: GlobalSettingsEmittingAPI = {
  setGlobalSetting: ([ key, value ]) =>
    ipcRenderer.send("settings-window-change-setting", key, value),
}
