import Debug from "debug"
import { BrowserWindow, app, ipcMain, shell } from "electron"
import windowStateKeeper from "electron-window-state"
import * as path from "node:path"
import type { Database } from "../database/index.ts"
import { InitialSetupEventMessage } from "../main_window_preload/index.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { getWindowBackgroundColor } from "./nativeTheme.ts"
const debug = Debug("main:main")

let mainWindow: BrowserWindow | undefined = undefined

/**
 * Creates the main window with the loaded database and returns its instance.
 */
export const createMainWindow = async (database: Database) => {
  if (mainWindow === undefined) {
    debug("Create Window ...")

    debug("Initialize window state keeper")
    const mainWindowState = windowStateKeeper({
      defaultHeight: 720,
      defaultWidth: 1280,
      file: "window.json",
    })

    debug("Initialize browser window")
    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      height: mainWindowState.height,
      width: mainWindowState.width,
      minHeight: 720,
      minWidth: 1280,
      resizable: true,
      icon: path.join(app.getAppPath(), "app", "icon.png"),
      frame: false,
      center: true,
      title: "Optolith",
      acceptFirstMouse: true,
      backgroundColor: getWindowBackgroundColor(getGlobalSettings().theme),
      webPreferences: {
        preload: path.join(__dirname, "renderer_main_preload.cjs"),
      },
      show: false,
      titleBarStyle: "hiddenInset",
    })

    mainWindow.webContents.setWindowOpenHandler(details => {
      shell.openExternal(details.url).catch(err => debug("unexpected error: %O", err))
      return { action: "deny" }
    })

    debug("Manage browser window with state keeper")
    mainWindowState.manage(mainWindow)

    debug("Load file")

    try {
      await mainWindow.loadFile(path.join(".webpack", "renderer_main.html"))
    } catch (error) {
      debug("Error loading file: %O", error)
    }

    debug("Loaded file")

    // mainWindow.webContents.openDevTools()

    if (mainWindowState.isMaximized) {
      debug("Maximize window ...")
      mainWindow.maximize()
    }

    mainWindow.on("maximize", () => mainWindow?.webContents.send("maximize"))
    mainWindow.on("unmaximize", () => mainWindow?.webContents.send("unmaximize"))
    mainWindow.on("blur", () => mainWindow?.webContents.send("blur"))
    mainWindow.on("focus", () => mainWindow?.webContents.send("focus"))

    ipcMain.handle("main-window-receive-is-maximized", _ => mainWindow?.isMaximized())
    ipcMain.handle("main-window-receive-is-focused", _ => mainWindow?.isFocused())

    ipcMain.on("main-window-minimize", () => mainWindow?.minimize())
    ipcMain.on("main-window-maximize", () => mainWindow?.maximize())
    ipcMain.on("main-window-restore", () => mainWindow?.restore())
    ipcMain.on("main-window-close", () => mainWindow?.close())
    ipcMain.on("main-window-toggle-dev-tools", () => mainWindow?.webContents.toggleDevTools())
    ipcMain.on("main-window-set-title", (_, title) => mainWindow?.setTitle(title))

    mainWindow.on("closed", () => {
      debug("closed")
      mainWindow = undefined

      ipcMain.removeHandler("main-window-receive-is-maximized")
      ipcMain.removeHandler("main-window-receive-is-focused")

      ipcMain.removeAllListeners("main-window-minimize")
      ipcMain.removeAllListeners("main-window-maximize")
      ipcMain.removeAllListeners("main-window-restore")
      ipcMain.removeAllListeners("main-window-close")
      ipcMain.removeAllListeners("main-window-toggle-dev-tools")
    })

    const initialSetupEventMessage: InitialSetupEventMessage = {
      database,
      globalSettings: getGlobalSettings(),
      systemLocale: app.getLocale(),
    }

    mainWindow.webContents.send("initial-setup", initialSetupEventMessage)

    ipcMain.once("initial-setup-done", () => {
      debug("initial setup done")
      mainWindow?.show()
    })
  } else {
    mainWindow.focus()
  }

  return mainWindow
}
