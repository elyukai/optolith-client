import Debug from "debug"
import { BrowserWindow, app, ipcMain } from "electron"
import * as path from "node:path"
import * as url from "node:url"
import { Database } from "../database/index.ts"
import type { InitialSetupEventMessage } from "../settings_window_preload/index.ts"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import { attachGlobalSettingsBroadcastToWindow, attachGlobalSettingsChanged, getGlobalSettings } from "../shared/settings/main.ts"
import { getWindowBackgroundColor, setNativeTheme } from "./nativeTheme.ts"
const debug = Debug("main:settings")

let settingsWindow: BrowserWindow | undefined = undefined

export const createSettingsWindow = async (
  database: Database,
  onLocaleChanged: (newLocale: string | undefined) => void,
) => {
  if (settingsWindow === undefined) {
    debug("create window ...")

    debug("initialize window")
    settingsWindow = new BrowserWindow({
      height: 310, // 420
      width: 500, // 640
      // resizable: false,
      icon: path.join(app.getAppPath(), "app", "icon.png"),
      frame: false,
      center: true,
      title: "Optolith",
      acceptFirstMouse: true,
      backgroundColor: getWindowBackgroundColor(getGlobalSettings().theme),
      webPreferences: {
        preload: path.join(__dirname, "renderer_settings_preload.js"),
      },
      show: false,
      titleBarStyle: "hidden",
      fullscreenable: false,
      maximizable: false,
      minimizable: false,
    })

    debug("load url")
    await settingsWindow.loadURL(url.format({
      pathname: path.join(__dirname, "renderer_settings.html"),
      protocol: "file:",
      slashes: true,
    }))

    // mainWindow.on("maximize", () => mainWindow.webContents.send("maximize"))

    // ipcMain.handle("receive-is-maximized", _ => mainWindow.isMaximized())

    // ipcMain.on("minimize", () => mainWindow.minimize())
    ipcMain.on("settings-window-close", () => settingsWindow?.close())
    ipcMain.on("settings-window-set-title", (_, title) => settingsWindow?.setTitle(title))

    settingsWindow.on("blur", () => settingsWindow?.webContents.send("blur"))
    settingsWindow.on("focus", () => settingsWindow?.webContents.send("focus"))

    attachGlobalSettingsChanged(settingsWindow, (key, value) => {
      if (key === "theme") {
        setNativeTheme(value as GlobalSettings["theme"])
      }
      else if (key === "locale") {
        onLocaleChanged(value as GlobalSettings["locale"])
      }
    })
    attachGlobalSettingsBroadcastToWindow(settingsWindow)

    settingsWindow.on("closed", () => {
      settingsWindow = undefined
      // ipcMain.removeAllListeners("receive-is-maximized")

      ipcMain.removeAllListeners("settings-window-close")
      ipcMain.removeAllListeners("settings-window-set-title")
    })

    const initialSetupEventMessage: InitialSetupEventMessage = {
      translations: Object.fromEntries(database.ui),
      locales: Object.fromEntries(database.locales),
      systemLocale: app.getLocale(),
      settings: getGlobalSettings(),
    }

    settingsWindow.webContents.send("initial-setup", initialSetupEventMessage)

    settingsWindow.show()
  }
  else {
    settingsWindow.focus()
  }

  return settingsWindow
}
