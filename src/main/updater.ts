import Debug from "debug"
import { BrowserWindow, app, ipcMain } from "electron"
import { CancellationToken, UpdateCheckResult, autoUpdater } from "electron-updater"
import * as path from "node:path"
import * as url from "node:url"
import appIconMacOS from "../assets/icon/AppIcon.icns"
import { Database } from "../database/index.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { InitialSetupEventMessage } from "../updater_window_preload/index.ts"
const debug = Debug("main:updater")

type AvailableUpdateCheckResult = {
  cancellationToken: CancellationToken
} & Omit<UpdateCheckResult, "cancellationToken">

/**
 * Checks for updates and returns a `CancellationToken` if an update is
 * available.
 */
const checkForUpdates = async (): Promise<AvailableUpdateCheckResult | undefined> => {
  const res = await autoUpdater.checkForUpdates()

  if (res?.cancellationToken === undefined) {
    return undefined
  }
  else {
    return res as AvailableUpdateCheckResult
  }
}

const createUpdaterWindow = async (database: Database) => {
  debug("create window")
  const updaterWindow = new BrowserWindow({
    icon: appIconMacOS,
    center: true,
    title: "Optolith",
    acceptFirstMouse: true,
    frame: false,
    width: 400,
    height: 100,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "renderer_updater_preload.js"),
    },
    show: false,
    titleBarStyle: "hidden",
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
  })

  await updaterWindow.loadURL(url.format({
    pathname: path.join(__dirname, "renderer_updater.html"),
    protocol: "file:",
    slashes: true,
  }))

  const initialSetupEventMessage: InitialSetupEventMessage = {
    translations: Object.fromEntries(database.ui),
    locales: Object.fromEntries(database.locales),
    globalSettings: getGlobalSettings(),
    systemLocale: app.getLocale(),
    locale: getGlobalSettings().locale,
  }

  updaterWindow.webContents.send("initial-setup", initialSetupEventMessage)

  autoUpdater.on("error", (err: Error) => {
    debug("error %O", err)
    updaterWindow.webContents.send("auto-updater-error", err)
  })

  ipcMain.on("updater-window-set-title", (_, title) => updaterWindow.setTitle(title))

  updaterWindow.on("closed", () => {
    autoUpdater.removeAllListeners("error")
    autoUpdater.removeAllListeners("download-progress")
    autoUpdater.removeAllListeners("update-downloaded")
    ipcMain.removeAllListeners("download-update")
    ipcMain.removeAllListeners("install-update-later")
    ipcMain.removeAllListeners("quit-and-install-update")
    ipcMain.removeAllListeners("updater-window-set-title")
  })

  return updaterWindow
}

const prepareUpdaterWindowForAvailableUpdate = (
  updaterWindow: BrowserWindow,
  checkResult: AvailableUpdateCheckResult,
  onApplyUpdate?: () => void,
  onCancelUpdate?: () => void,
) => {
  const { updateInfo, cancellationToken } = checkResult

  updaterWindow.webContents.send("update-available", updateInfo)

  autoUpdater.signals.progress(progressObj => {
    debug("download progress at %d %", progressObj.percent)
    updaterWindow.webContents.send("download-progress", progressObj)
  })

  autoUpdater.signals.updateDownloaded(info => {
    debug("update downloaded to %s", info.downloadedFile)
    updaterWindow.webContents.send("update-downloaded", info)
  })

  ipcMain.on("download-update-later", () => {
    debug("download update later")
    onCancelUpdate?.()
    updaterWindow.close()
  })

  ipcMain.on("download-update", () => {
    debug("downloading update ...")
    autoUpdater.downloadUpdate(cancellationToken).catch(console.error)
  })

  ipcMain.on("install-update-later", () => {
    debug("install update later")
    onCancelUpdate?.()
    updaterWindow.close()
  })

  ipcMain.on("quit-and-install-update", () => {
    debug("quit and install update")
    onApplyUpdate?.()
    autoUpdater.quitAndInstall()
  })
}

export const checkForUpdatesOnStartup = async (database: Database) => {
  debug("checking for updates ...")

  const checkResult = await checkForUpdates()
  const isUpdateAvailable = checkResult !== undefined

  if (isUpdateAvailable) {
    debug("update is available")
    const updaterWindow = await createUpdaterWindow(database)
    const updatePromise = new Promise<boolean>(resolve => {
      prepareUpdaterWindowForAvailableUpdate(
        updaterWindow,
        checkResult,
        () => resolve(true),
        () => resolve(false),
      )
    })
    updaterWindow.show()
    return updatePromise
  }
  else {
    debug("no update available")
    return false
  }
}

export const checkForUpdatesOnRequest = async (database: Database) => {
  debug("checking for updates ...")
  const updaterWindow = await createUpdaterWindow(database)
  updaterWindow.show()
  const checkResult = await checkForUpdates()
  const isUpdateAvailable = checkResult !== undefined

  if (isUpdateAvailable) {
    debug("update is available")
    prepareUpdaterWindowForAvailableUpdate(updaterWindow, checkResult)
  }
  else {
    debug("no update available")
    updaterWindow.webContents.send("no-update-available")
  }

  return isUpdateAvailable
}
