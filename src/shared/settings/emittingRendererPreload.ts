import { ipcRenderer } from "electron"
import { TypedEventEmitterForEvent } from "../utils/events.ts"
import { GlobalSettings } from "./GlobalSettings.ts"

export type GlobalSettingsEvents =
  TypedEventEmitterForEvent<"locale-changed", [newLocale: GlobalSettings["locale"]]>

export type GlobalSettingsEmittingAPI = {
  setGlobalSetting: (keyValue: {
    [K in keyof GlobalSettings]: [key: K, newValue: GlobalSettings[K]]
  }[keyof GlobalSettings]) => void
}

export const getGlobalSettingsEmittingAPI = (
  events: GlobalSettingsEvents,
): GlobalSettingsEmittingAPI => ({
  setGlobalSetting: ([ key, value ]) => {
    if (key === "locale") {
      events.emit("locale-changed", value)
    }

    ipcRenderer.send("settings-window-change-setting", key, value)
  },
})
