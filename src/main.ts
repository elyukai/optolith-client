import { app, BrowserWindow, ipcMain } from "electron";
import * as log from "electron-log";
// tslint:disable-next-line:no-implicit-dependencies
import { autoUpdater, CancellationToken, UpdateInfo } from "electron-updater";
import * as path from "path";
import * as url from "url";
import { tryIO } from "./Control/Exception";
import { Either, fromLeft_, isLeft } from "./Data/Either";
import { existsFile, IdentityIO, IO, join, liftM2, liftM3, then } from "./System/IO";
// tslint:disable-next-line:ordered-imports
import windowStateKeeper = require("electron-window-state")

let mainWindow: Electron.BrowserWindow | null | undefined

app.setAppUserModelId ("lukasobermann.optolith")

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
  (fileName: string) => {
    const originPath = path.join (originFolder, `${fileName}.json`)
    const destPath = path.join (destFolder, `${fileName}.json`)

    return join (liftM2 ((origin_exists: boolean) => (dest_exists: boolean) =>
                          !dest_exists && origin_exists
                            ? IO.copyFile (originPath) (destPath)
                            : IdentityIO)
                        (existsFile (originPath))
                        (existsFile (destPath)))
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
    backgroundColor: "#000000",
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
    .catch (err => { console.error (err); })

  mainWindow.webContents.openDevTools ()

  mainWindow.once ("ready-to-show", () => {
    mainWindow!.show ()
    if (mainWindowState.isMaximized) {
      mainWindow!.maximize ()
    }

    ipcMain.addListener ("loading-done", () => {
      if (process.platform !== "linux") {
        let cancellationToken: CancellationToken | undefined

        autoUpdater
          .checkForUpdates ()
          .then (res => {
            if (res.cancellationToken !== undefined) {
              cancellationToken = res.cancellationToken
              mainWindow!.webContents.send ("update-available", res.updateInfo)
            }
          })
          .catch (
            err => mainWindow!.webContents.send ("auto-updater-error", err)
          )

        autoUpdater.addListener ("update-available", (info: UpdateInfo) => {
          mainWindow!.webContents.send ("update-available", info)
          autoUpdater.removeAllListeners ("update-not-available")
        })

        ipcMain.addListener ("download-update", () => {
          autoUpdater
            .downloadUpdate (cancellationToken)
            .catch (
              err => mainWindow!.webContents.send ("auto-updater-error", err)
            )
        })

        ipcMain.addListener ("check-for-updates", () => {
          autoUpdater
            .checkForUpdates ()
            .then (res => {
              if (res.cancellationToken !== undefined) {
                cancellationToken = res.cancellationToken
                mainWindow!.webContents.send ("update-available", res.updateInfo)
              }
              else {
                mainWindow!.webContents.send ("update-not-available")
              }
            })
            .catch (
              err => mainWindow!.webContents.send ("auto-updater-error", err)
            )
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
      }
    })
  })

  mainWindow.on ("closed", () => {
    // tslint:disable-next-line:no-null-keyword
    mainWindow = null
  })
}

function main () {
  then (liftM3 ((w: Either<Error, void>) =>
                (h: Either<Error, void>) =>
                (c: Either<Error, void>) => {
                  if (isLeft (w)) {
                    console.warn (fromLeft_ (w))
                  }
                  else if (isLeft (h)) {
                    console.warn (fromLeft_ (h))
                  }
                  else if (isLeft (c)) {
                    console.warn (fromLeft_ (c))
                  }

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
               })
               (tryIO (copyFileToCurrent ("Optolyth") ("window")))
               (tryIO (copyFileToCurrent ("Optolyth") ("heroes")))
               (tryIO (copyFileToCurrent ("Optolyth") ("config"))))
       (IdentityIO)
}

app.on ("ready", main)
