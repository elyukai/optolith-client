import { IpcRenderer, IpcRendererEvent } from "electron"
import { TypedEventEmitter } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

export type GlobalSettingsEvents = {
  "global-setting-changed": [
    {
      [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
    }[keyof GlobalSettings],
  ]
  "locale-changed": [newLocale: GlobalSettings["locale"]]
  "fallback-locale-changed": [newFallbackLocale: GlobalSettings["fallbackLocale"]]
}

export type GlobalSettingsEventEmitter = TypedEventEmitter<GlobalSettingsEvents>

export const attachGlobalSettingsEvents = (
  ipcRenderer: IpcRenderer,
  preloadEvents: GlobalSettingsEventEmitter,
) =>
  ipcRenderer.on("global-setting-changed", (_event: IpcRendererEvent, key, value) => {
    preloadEvents.emit("global-setting-changed", [key, value])

    if (key === "locale") {
      preloadEvents.emit("locale-changed", value)
    } else if (key === "fallbackLocale") {
      preloadEvents.emit("fallback-locale-changed", value)
    }
  })
