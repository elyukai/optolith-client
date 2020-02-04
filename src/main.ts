import { app, BrowserWindow, ipcMain } from "electron"
import * as log from "electron-log"
import { autoUpdater, CancellationToken, UpdateInfo } from "electron-updater"
import { existsSync, mkdirSync } from "fs"
import * as path from "path"
import { prerelease } from "semver"
import * as url from "url"
import { tryIO } from "./Control/Exception"
import { fromLeft_, isLeft } from "./Data/Either"
import { fmapF } from "./Data/Functor"
import { Unit } from "./Data/Unit"
import { copyFile, existsFile } from "./System/IO"
import windowStateKeeper = require("electron-window-state")

app.setAppUserModelId ("lukasobermann.optolith")

let mainWindow: Electron.BrowserWindow | null = null

const isPrerelease = prerelease (app .getVersion ()) !== null

const userDataPath =
  path.join (app.getPath ("appData"), isPrerelease ? "Optolith Insider" : "Optolith")

if (!existsSync (userDataPath)) {
  mkdirSync (userDataPath)
}

app.setPath ("userData", userDataPath)

/**
 * Path to directory where all of the cached and saved files are located.
 *
 * * `%APPDATA%` on Windows,
 * * `$XDG_CONFIG_HOME` or `~/.config` on Linux,
 * * `~/Library/Application Support` on macOS,
 *
 * appended with the name of the app.
 */
const user_data_path = app.getPath ("userData")

/**
 * The path to the root directory of the packed ASAR, which is the root
 * directory of this project.
 */
const app_path = app.getAppPath ()

const copyFileFromToFolder =
  (originFolder: string) =>
  (destFolder: string) =>
  async (fileName: string) => {
    const originPath = path.join (originFolder, fileName)
    const destPath = path.join (destFolder, fileName)

    const origin_exists = await existsFile (originPath)
    const dest_exists = await existsFile (destPath)

    return !dest_exists && origin_exists
           ? copyFile (originPath) (destPath)
           : Promise.resolve ()
  }

const copyFileToCurrent =
  (origin: string) =>
    copyFileFromToFolder (path.join (user_data_path, "..", origin))
                         (user_data_path)

function createWindow () {
  const mainWindowState = windowStateKeeper ({
    defaultHeight: 720,
    defaultWidth: 1280,
    file: "window.json",
  })

  mainWindow = new BrowserWindow ({
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    minHeight: 720,
    minWidth: 1280,
    resizable: true,
    icon: path.join (app_path, "app", "icon.png"),
    frame: false,
    center: true,
    title: "Optolith",
    acceptFirstMouse: true,
    backgroundColor: "#111111",
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindowState.manage (mainWindow)

  mainWindow
    .loadURL (url.format ({
      pathname: path.join (__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }))
    .then (() => {
      // mainWindow!.webContents.openDevTools ()

      mainWindow!.show ()

      if (mainWindowState.isMaximized) {
        mainWindow!.maximize ()
      }

      ipcMain.addListener ("loading-done", () => {
        let cancellationToken: CancellationToken | undefined = undefined

        autoUpdater
          .checkForUpdates ()
          .then (res => {
            if (res.cancellationToken !== undefined) {
              const { cancellationToken: token } = res
              cancellationToken = token
              mainWindow!.webContents.send ("update-available", res.updateInfo)
            }
          })
          .catch (() => {})

        autoUpdater.addListener ("update-available", (info: UpdateInfo) => {
          mainWindow!.webContents.send ("update-available", info)
          autoUpdater.removeAllListeners ("update-not-available")
        })

        ipcMain.addListener ("download-update", () => {
          autoUpdater
            .downloadUpdate (cancellationToken)
            .catch (() => {})
        })

        ipcMain.addListener ("check-for-updates", () => {
          autoUpdater
            .checkForUpdates ()
            .then (res => {
              const { cancellationToken: token } = res

              if (token === undefined) {
                mainWindow!.webContents.send ("update-not-available")
              }
              else {
                cancellationToken = token
                mainWindow!.webContents.send ("update-available", res.updateInfo)
              }
            })
            .catch (() => {})
        })

        autoUpdater.signals.progress (progressObj => {
          mainWindow!.webContents.send ("download-progress", progressObj)
        })

        autoUpdater.addListener ("error", (err: Error) => {
          mainWindow!.webContents.send ("auto-updater-error", err)
        })

        autoUpdater.signals.updateDownloaded (() => {
          autoUpdater.quitAndInstall ()
        })
      })
    })
    .catch (err => console.error (err))

  mainWindow.on ("closed", () => {
    mainWindow = null
  })
}

const openMainWindow = () => {
  autoUpdater.logger = log
  // @ts-ignore
  autoUpdater.logger.transports.file.level = "info"
  autoUpdater.autoDownload = false

  createWindow ()

  app.on ("window-all-closed", () => {
    app.quit ()
  })

  app.on ("activate", () => {
    if (mainWindow === null) {
      createWindow ()
    }
  })

  return Unit
}

const copyAllFiles =
  async (copy: (fileName: string) => Promise<void>) => {
    await fmapF (tryIO (copy) ("window.json"))
                (x => isLeft (x) ? console.warn (fromLeft_ (x)) : undefined)

    await fmapF (tryIO (copy) ("heroes.json"))
                (x => isLeft (x) ? console.warn (fromLeft_ (x)) : undefined)

    await fmapF (tryIO (copy) ("config.json"))
                (x => isLeft (x) ? console.warn (fromLeft_ (x)) : undefined)
  }

const main = () => {
  if (isPrerelease) {
    copyAllFiles (copyFileFromToFolder (path.join (user_data_path, "..", "Optolyth"))
                                       (path.join (user_data_path, "..", "Optolith")))
      .then (async () => fmapF (copyAllFiles (copyFileToCurrent ("Optolith")))
                               (openMainWindow))
      .catch (() => undefined)
  }
  else {
    fmapF (copyAllFiles (copyFileToCurrent ("Optolyth")))
          (openMainWindow)
      .catch (() => undefined)
  }
}

app.on ("ready", main)
