import { ipcRenderer } from "electron"
import { TypedEventEmitter } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

export type GlobalSettingsEvents = {
  "locale-changed": [newLocale: GlobalSettings["locale"]]
  "fallback-locale-changed": [newFallbackLocale: GlobalSettings["fallbackLocale"]]
}

export type GlobalSettingsEventEmitter = TypedEventEmitter<GlobalSettingsEvents>

export type GlobalSettingsEmittingAPI = {
  setGlobalSetting: (
    keyValue: {
      [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
    }[keyof GlobalSettings],
  ) => void
}

export const getGlobalSettingsEmittingAPI = (
  events: GlobalSettingsEventEmitter,
): GlobalSettingsEmittingAPI => ({
  setGlobalSetting: ([key, value]) => {
    if (key === "locale") {
      events.emit("locale-changed", value)
    } else if (key === "fallbackLocale") {
      events.emit("fallback-locale-changed", value)
    }

    ipcRenderer.send("settings-window-change-setting", key, value)
  },
})
