import type { TSONDBTypes } from "@optolith/database-schema"
import type { Cache } from "@optolith/database-schema/cache"
import type { Locale } from "@optolith/database-schema/gen"
import Debug from "debug"
import { BrowserWindow, app, ipcMain, shell } from "electron"
import * as path from "node:path"
import type { ReadonlyTSONDB } from "tsondb/readonly"
import { InitialSetupEventMessage } from "../main_window_preload/index.ts"
import type { Characters } from "../shared/domain/character.ts"
import { globalSettings } from "../shared/settings/main.ts"
import { attachStateSelectorsToWindow } from "../shared/state.ts"
import { getWindowBackgroundColor } from "./nativeTheme.ts"

const debug = Debug("main:main")
const debugRenderer = Debug("main:main:renderer")

let mainWindow: BrowserWindow | undefined = undefined

/**
 * Creates the main window with the loaded database and returns its instance.
 */
export const createMainWindow = async (
  locales: Record<string, Locale>,
  database: ReadonlyTSONDB<TSONDBTypes>,
  cache: Cache,
  characters: Characters,
) => {
  if (mainWindow === undefined) {
    debug("Create Window ...")

    debug("Initialize browser window")
    mainWindow = new BrowserWindow({
      name: "main",
      windowStatePersistence: true,
      height: 720,
      width: 1280,
      minHeight: 720,
      minWidth: 1280,
      resizable: true,
      icon: path.join(app.getAppPath(), "app", "icon.png"),
      frame: false,
      center: true,
      title: "Optolith",
      acceptFirstMouse: true,
      backgroundColor: getWindowBackgroundColor(globalSettings.theme),
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

    debug("Load file")

    try {
      await mainWindow.loadFile(path.join(".webpack", "renderer_main.html"))
    } catch (error) {
      debug("Error loading file: %O", error)
    }

    debug("Loaded file")

    // mainWindow.webContents.openDevTools()

    mainWindow.on("maximize", () => mainWindow?.webContents.send("maximize"))
    mainWindow.on("unmaximize", () => mainWindow?.webContents.send("unmaximize"))
    mainWindow.on("blur", () => mainWindow?.webContents.send("blur"))
    mainWindow.on("focus", () => mainWindow?.webContents.send("focus"))

    ipcMain.handle("main-window-receive-is-maximized", () => mainWindow?.isMaximized())
    ipcMain.handle("main-window-receive-is-focused", () => mainWindow?.isFocused())

    ipcMain.on("main-window-minimize", () => mainWindow?.minimize())
    ipcMain.on("main-window-maximize", () => mainWindow?.maximize())
    ipcMain.on("main-window-restore", () => mainWindow?.restore())
    ipcMain.on("main-window-close", () => mainWindow?.close())
    ipcMain.on("main-window-toggle-dev-tools", () => mainWindow?.webContents.toggleDevTools())
    ipcMain.on("main-window-set-title", (_, title) => mainWindow?.setTitle(title))
    ipcMain.on("main-window-log", (_, formatter, ...args) => debugRenderer(formatter, ...args))

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
      database: database.schema.entities.map(entity => [
        entity.name,
        database.getAllInstanceContainersOfEntity(entity.name),
      ]),
      cache,
      locales,
      globalSettings: globalSettings.toJSON(),
      systemLocale: app.getLocale(),
    }

    ipcMain.once("initial-setup-done", () => {
      debug("initial setup done")

      if (mainWindow) {
        attachStateSelectorsToWindow(
          mainWindow,
          characters.characters["550e8400-e29b-11d4-a716-446655440000"]!.selectors,
        )

        mainWindow.show()
      }
    })

    mainWindow.webContents.send("initial-setup", initialSetupEventMessage)
  } else {
    mainWindow.focus()
  }

  return mainWindow
}
