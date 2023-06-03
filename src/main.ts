import { app, ipcMain, utilityProcess } from "electron"
import { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, installExtension } from "electron-extension-installer"
import { autoUpdater } from "electron-updater"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import * as process from "node:process"
import type { Database } from "./database.ts"
import { createMainWindow, showMainWindow } from "./main/mainWindow.ts"
import { ensureUserDataPathExists } from "./main/saveData.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./main/updater.ts"

app.setAppUserModelId("lukasobermann.optolith")

console.log("main: loading database ...")
const databaseProcess = utilityProcess.fork(join(__dirname, "./database.js"))
const databaseLoading = new Promise<Database>(resolve => {
  databaseProcess.on("message", (message: Database) => {
    console.log("main: database loaded")
    resolve(message)
  })
})

console.log(process.platform)

const runAsync = (fn: () => Promise<void>) => () => {
  fn().catch(err => console.error("main: unexpected error", err))
}

const setUserDataPath = async () => {
  console.log("main: set user data path ...")
  app.setPath("userData", await ensureUserDataPathExists())
}

const installExtensions = async () => {
  console.log("main: install extensions ...")

  const installedExtensions = await installExtension([
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  ])

  const installedExtensionsString =
    Array.isArray(installedExtensions)
      ? installedExtensions.join(", ")
      : installedExtensions

  console.log(`main: installed extensions: ${installedExtensionsString}`)
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
  console.log("main: install update instead of startup", installUpdateInsteadOfStartup)
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
