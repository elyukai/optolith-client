import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { isNotNullish } from "@elyukai/utils/nullable"
import { BrowserWindow, type Event, ipcMain } from "electron"
import { computed, observable } from "mobx"
import type { GlobalSettings, Theme } from "./GlobalSettings.ts"

class GlobalSettingsManager {
  static instance: GlobalSettingsManager = new GlobalSettingsManager()

  @observable accessor locale: string | undefined
  @observable accessor fallbackLocale: string | undefined
  @observable accessor theme: Theme | undefined
  @observable accessor isEditAfterCreationEnabled: boolean = false
  @observable accessor areAnimationsEnabled: boolean = false

  @computed
  get locales(): NonEmptyArray<string> {
    return [this.locale, this.fallbackLocale].filter(isNotNullish) as NonEmptyArray<string>
  }

  toJSON(): GlobalSettings {
    return {
      locale: this.locale,
      fallbackLocale: this.fallbackLocale,
      theme: this.theme,
      isEditAfterCreationEnabled: this.isEditAfterCreationEnabled,
      areAnimationsEnabled: this.areAnimationsEnabled,
    }
  }
}

/**
 * Attach a listener to the settings window that updates the global settings
 * when a setting is changed from the settings window.
 * @param settingsWindow The settings window instance.
 * @param listener The listener that is called when a setting is changed from
 * the settings window.
 */
export const attachGlobalSettingsChanged = (
  settingsWindow: BrowserWindow,
  listener: <K extends keyof GlobalSettings>(key: K, value: GlobalSettingsManager[K]) => void,
) => {
  ipcMain.on(
    "settings-window-change-setting",
    <K extends keyof GlobalSettings>(_: Event, key: K, value: GlobalSettingsManager[K]) => {
      GlobalSettingsManager.instance[key] = value
      listener(key, value)
    },
  )

  settingsWindow.on("closed", () => {
    ipcMain.removeAllListeners("settings-window-change-setting")
  })
}

/**
 * Attach a listener to the settings window that broadcasts the global settings
 * to all other windows when a setting is changed from the settings window.
 * @param settingsWindow The settings window instance.
 * @param getWindowBackgroundColor A function that maps a theme to a hex color
 * string for the background.
 */
export const attachGlobalSettingsBroadcastToWindow = (
  settingsWindow: BrowserWindow,
  getWindowBackgroundColor: (theme: Theme | undefined) => string,
) => {
  attachGlobalSettingsChanged(settingsWindow, (key, value) => {
    BrowserWindow.getAllWindows().forEach(window => {
      if (key === "theme") {
        window.setBackgroundColor(getWindowBackgroundColor(value as Theme | undefined))
      }

      if (window !== settingsWindow) {
        window.webContents.send("global-setting-changed", key, value)
      }
    })
  })
}

/**
 * Get the currently stored global settings
 */
export const globalSettings = GlobalSettingsManager.instance
