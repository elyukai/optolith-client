import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { isNotNullish } from "@elyukai/utils/nullable"
import { BrowserWindow, Event, ipcMain } from "electron"
import { computed, observable } from "mobx"
import { GlobalSettings, Theme } from "./GlobalSettings.ts"

const _globalSettings: GlobalSettings = observable({
  locale: "de-DE",
  fallbackLocale: undefined,
  theme: undefined,
  isEditAfterCreationEnabled: false,
  areAnimationsEnabled: false,
})

class GlobalSettingsManager {
  static instance: GlobalSettingsManager = new GlobalSettingsManager()

  @computed
  get locale(): string {
    return _globalSettings.locale
  }

  @computed
  get fallbackLocale(): string | undefined {
    return _globalSettings.fallbackLocale
  }

  @computed
  get theme(): Theme | undefined {
    return _globalSettings.theme
  }

  @computed
  get isEditAfterCreationEnabled(): boolean {
    return _globalSettings.isEditAfterCreationEnabled
  }

  @computed
  get areAnimationsEnabled(): boolean {
    return _globalSettings.areAnimationsEnabled
  }

  @computed
  get locales(): NonEmptyArray<string> {
    return [_globalSettings.locale, _globalSettings.fallbackLocale].filter(
      isNotNullish,
    ) as NonEmptyArray<string>
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
  listener: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void,
) => {
  ipcMain.on(
    "settings-window-change-setting",
    <K extends keyof GlobalSettings>(_: Event, key: K, value: GlobalSettings[K]) => {
      _globalSettings[key] = value
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
