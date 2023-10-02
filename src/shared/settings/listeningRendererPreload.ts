import { IpcRenderer, IpcRendererEvent } from "electron"
import { TypedEventEmitter } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

/**
 * A map of global setting event definitions for renderer processes other than
 * the settings window.
 */
export type GlobalSettingsEvents = {
  "global-setting-changed": [
    {
      [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
    }[keyof GlobalSettings],
  ]
  "locale-changed": [newLocale: GlobalSettings["locale"]]
  "fallback-locale-changed": [newFallbackLocale: GlobalSettings["fallbackLocale"]]
}

/**
 * A typed event emitter for global settings events for renderer processes other
 * than the settings window.
 */
export type GlobalSettingsEventEmitter = TypedEventEmitter<GlobalSettingsEvents>

/**
 * Attach a listener to the main process that updates the global settings when a
 * setting is changed from the settings window.
 */
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
