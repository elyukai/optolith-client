import type { Locale } from "@optolith/database-schema/gen"
import Debug from "debug"
import { BrowserWindow, app, ipcMain, shell } from "electron"
import { runInAction } from "mobx"
import * as path from "node:path"
import type { InitialSetupEventMessage } from "../main_window_preload/index.ts"
import type { Characters } from "../shared/domain/character.ts"
import type { Global } from "../shared/global.ts"
import { globalSettings } from "../shared/settings/main.ts"
import { attachKeyedStateSelectorsToWindow, attachStateSelectorsToWindow } from "../shared/state.ts"
import type { GlobalIPCSelectors } from "./index.ts"
import { getWindowBackgroundColor } from "./nativeTheme.ts"

const debug = Debug("main:main")
debug.log = console.log.bind(console)
const debugRenderer = Debug("main:main:renderer")
debugRenderer.log = console.log.bind(console)

let mainWindow: BrowserWindow | undefined = undefined

/**
 * Creates the main window with the loaded database and returns its instance.
 */
export const createMainWindow = async (
  global: Global,
  locales: Record<string, Locale>,
  globalState: GlobalIPCSelectors,
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
      backgroundColor: getWindowBackgroundColor(runInAction(() => globalSettings.theme)),
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

    if (process.argv.includes("--devtools")) {
      mainWindow.webContents.openDevTools()
    }

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

    const safeWindow = mainWindow
    runInAction(() => attachStateSelectorsToWindow(safeWindow, globalState, debug))
    runInAction(() =>
      attachKeyedStateSelectorsToWindow(
        safeWindow,
        () => characters.characters,
        character => character.selectors,
        debug,
      ),
    )

    const initialSetupEventMessage: InitialSetupEventMessage = {
      database: global.db.schema.entities.map(entity => [
        entity.name,
        global.db.getAllInstanceContainersOfEntity(entity.name),
      ]),
      cache: global.cache,
      locales,
      globalSettings: runInAction(() => globalSettings.toJSON()),
      systemLocale: app.getLocale(),
      settings: global.settings,
    }

    ipcMain.once("initial-setup-done", () => {
      debug("initial setup done")

      if (mainWindow !== undefined) {
        mainWindow.show()
      }
    })

    mainWindow.webContents.send("initial-setup", initialSetupEventMessage)
  } else {
    mainWindow.focus()
  }

  return mainWindow
}
