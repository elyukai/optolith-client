import { BrowserWindow, Event, ipcMain } from "electron"
import { GlobalSettings } from "./GlobalSettings.ts"

const globalSettings: GlobalSettings = {
  locale: "de-DE",
  fallbackLocale: undefined,
  theme: undefined,
  isEditAfterCreationEnabled: false,
  areAnimationsEnabled: false,
}

export const attachGlobalSettingsChanged = (
  settingsWindow: BrowserWindow,
  listener: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void
) => {
  ipcMain.on(
    "settings-window-change-setting",
    <K extends keyof GlobalSettings>(_: Event, key: K, value: GlobalSettings[K]) => {
      globalSettings[key] = value
      listener(key, value)
    }
  )

  settingsWindow.on("closed", () => {
    ipcMain.removeAllListeners("settings-window-change-setting")
  })
}

export const attachGlobalSettingsBroadcastToWindow = (settingsWindow: BrowserWindow) => {
  attachGlobalSettingsChanged(settingsWindow, (key, value) => {
    BrowserWindow.getAllWindows().forEach(window => {
      if (window !== settingsWindow) {
        window.webContents.send("global-setting-changed", key, value)
      }
    })
  })
}

export const getGlobalSettings = () => globalSettings
