import { ipcRenderer } from "electron"
import { TypedEventEmitter } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

/**
 * A map of global setting event definitions for the settings window.
 */
export type GlobalSettingsEvents = {
  "locale-changed": [newLocale: GlobalSettings["locale"]]
  "fallback-locale-changed": [newFallbackLocale: GlobalSettings["fallbackLocale"]]
}

/**
 * A typed event emitter for global settings events for the settings window.
 */
export type GlobalSettingsEventEmitter = TypedEventEmitter<GlobalSettingsEvents>

/**
 * Functions for emitting global settings events.
 */
export type GlobalSettingsEmittingAPI = {
  setGlobalSetting: (
    keyValue: {
      [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
    }[keyof GlobalSettings],
  ) => void
}

/**
 * Get the API for emitting global settings events by providing an available
 * event emitter for global settings events (this should usually be the preload
 * API).
 */
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
