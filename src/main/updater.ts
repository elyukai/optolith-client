import { BrowserWindow, ipcMain } from "electron"
import { CancellationToken, UpdateCheckResult, autoUpdater } from "electron-updater"
import * as path from "node:path"
import * as url from "node:url"
import appIconMacOS from "../assets/icon/AppIcon.icns"

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

const createUpdaterWindow = async () => {
  const updaterWindow = new BrowserWindow({
    icon: appIconMacOS,
    center: true,
    title: "Optolith Update Available",
    acceptFirstMouse: true,
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "renderer_updater_preload.js"),
    },
    show: false,
  })

  await updaterWindow.loadURL(url.format({
    pathname: path.join(__dirname, "renderer_updater.html"),
    protocol: "file:",
    slashes: true,
  }))

  updaterWindow.webContents.openDevTools()

  autoUpdater.on("error", (err: Error) => {
    console.log("updater: error", err)
    updaterWindow.webContents.send("auto-updater-error", err)
  })

  updaterWindow.on("closed", () => {
    autoUpdater.removeAllListeners("error")
    autoUpdater.removeAllListeners("download-progress")
    autoUpdater.removeAllListeners("update-downloaded")
    ipcMain.removeAllListeners("download-update")
    ipcMain.removeAllListeners("install-update-later")
    ipcMain.removeAllListeners("quit-and-install-update")
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
    console.log(`updater: download progress at ${progressObj.percent} %`)
    updaterWindow.webContents.send("download-progress", progressObj)
  })

  autoUpdater.signals.updateDownloaded(info => {
    console.log(`updater: update downloaded to "${info.downloadedFile}"`)
    updaterWindow.webContents.send("update-downloaded", info)
  })

  ipcMain.on("download-update-later", () => {
    console.log(`updater: download update later`)
    onCancelUpdate?.()
    updaterWindow.close()
  })

  ipcMain.on("download-update", () => {
    console.log(`updater: downloading update ...`)
    autoUpdater.downloadUpdate(cancellationToken).catch(console.error)
  })

  ipcMain.on("install-update-later", () => {
    console.log(`updater: install update later`)
    onCancelUpdate?.()
    updaterWindow.close()
  })

  ipcMain.on("quit-and-install-update", () => {
    console.log(`updater: quit and install update`)
    onApplyUpdate?.()
    autoUpdater.quitAndInstall()
  })
}

export const checkForUpdatesOnStartup = async () => {
  console.log("updater: checking for updates ...")

  const checkResult = await checkForUpdates()
  const isUpdateAvailable = checkResult !== undefined

  if (isUpdateAvailable) {
    console.log("updater: update is available")
    const updaterWindow = await createUpdaterWindow()
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
    console.log("updater: no update available")
    return false
  }
}

export const checkForUpdatesOnRequest = async () => {
  console.log("updater: checking for updates ...")
  const updaterWindow = await createUpdaterWindow()
  updaterWindow.show()
  const checkResult = await checkForUpdates()
  const isUpdateAvailable = checkResult !== undefined

  if (isUpdateAvailable) {
    console.log("updater: update is available")
    prepareUpdaterWindowForAvailableUpdate(updaterWindow, checkResult)
  }
  else {
    console.log("updater: no update available")
    updaterWindow.webContents.send("no-update-available")
  }

  return isUpdateAvailable
}
