import Debug from "debug"
import { app, ipcMain, utilityProcess } from "electron"
import { autoUpdater } from "electron-updater"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Database } from "../database/index.ts"
import { createMainWindow, showMainWindow } from "./mainWindow.ts"
import { ensureUserDataPathExists } from "./saveData.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./updater.ts"
const debug = Debug("main")

app.setAppUserModelId("lukasobermann.optolith")

debug("loading database ...")
const databaseProcess = utilityProcess.fork(join(__dirname, "./database.js"))
const databaseLoading = new Promise<Database>(resolve => {
  databaseProcess.on("message", (message: Database) => {
    debug("database received")
    resolve(message)
  })
})

const runAsync = (fn: () => Promise<void>) => () => {
  fn().catch(err => debug("unexpected error: %O", err))
}

const setUserDataPath = async () => {
  debug("setting user data path ...")
  app.setPath("userData", await ensureUserDataPathExists())
}

const installExtensions = async () => {
  debug("install extensions ...")

  const installedExtensions: string[] | string | undefined =
    await Promise.resolve(undefined as string[] | string | undefined) /* await installExtension([
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    ]) */

  const installedExtensionsString =
    Array.isArray(installedExtensions)
      ? installedExtensions.join(", ")
      : installedExtensions ?? "none"

  debug("installed extensions: %s", installedExtensionsString)
}

const readFileInAppPath = (...path: string[]) => readFile(join(app.getAppPath(), ...path), "utf-8")

const registerGlobalListeners = () => {
  ipcMain.handle("receive-license", _ => readFileInAppPath("LICENSE"))
  ipcMain.handle("receive-changelog", _ => readFileInAppPath("CHANGELOG.md"))
  ipcMain.handle("receive-version", _ => app.getVersion())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.whenReady().then(async () => {
  autoUpdater.autoDownload = false

  app.on("window-all-closed", () => {
    app.quit()
  })

  const installUpdateInsteadOfStartup = await checkForUpdatesOnStartup()
  debug("skip startup because of update?", installUpdateInsteadOfStartup ? "yes" : "no")
  if (!installUpdateInsteadOfStartup) {
    await setUserDataPath()
    await installExtensions()
    registerGlobalListeners()
    showMainWindow(await createMainWindow(), await databaseLoading)

    ipcMain.on("check-for-update", runAsync(async () => {
      await checkForUpdatesOnRequest()
    }))
  }
})
