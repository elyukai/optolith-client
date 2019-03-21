import { app, BrowserWindow, ipcMain } from "electron";
import * as log from "electron-log";
// tslint:disable-next-line:no-implicit-dependencies
import { autoUpdater, CancellationToken, UpdateInfo } from "electron-updater";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";
// tslint:disable-next-line:ordered-imports
import windowStateKeeper = require("electron-window-state")

let mainWindow: Electron.BrowserWindow | null | undefined

app.setAppUserModelId ("lukasobermann.optolith")

const userDataPath = app.getPath ("userData")

const accessPromise = async (pathToFile: string) => new Promise<boolean> (
  resolve => {
    fs.access (pathToFile, err => {
      if (err !== null) {
        resolve (false)
      }

      resolve (true)
    })
  }
)

const copyFile = (origin: string) => (dest: string) => async (fileName: string) => {
  const newJSONPath = path.join (userDataPath, "..", dest, `${fileName}.json`)

  let hasNewJSON

  try {
    hasNewJSON = await accessPromise (newJSONPath)
  }
  catch (err) {
    log.error (`Could not load or read ${fileName}.json (${err})`)

    return
  }

  const oldJSONPath = path.join (userDataPath, "..", origin, `${fileName}.json`)

  let hasOldJSON

  try {
    hasOldJSON = await accessPromise (oldJSONPath)
  }
  catch (err) {
    log.error (`Could not load or read ${fileName}.json (${err})`)

    return
  }

  if (!hasNewJSON && hasOldJSON) {
    try {
      fs.createReadStream (oldJSONPath).pipe (fs.createWriteStream (newJSONPath))
    }
    catch (err) {
      log.error (`Could not load or read ${fileName}.json (${err})`)
    }
  }

  return
}

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
    icon: path.join (app.getAppPath (), "app", "icon.png"),
    frame: false,
    center: true,
    title: "Optolith",
    acceptFirstMouse: true,
    backgroundColor: "#000000",
    show: false,
  })

  mainWindowState.manage (mainWindow)

  mainWindow.loadURL (url.format ({
    pathname: path.join (__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  }))

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

async function main () {
  await copyFile ("TDE5 Heroes") ("Optolyth") ("window")
  await copyFile ("TDE5 Heroes") ("Optolyth") ("heroes")
  await copyFile ("TDE5 Heroes") ("Optolyth") ("config")

  await copyFile ("Optolyth") ("Optolith") ("window")
  await copyFile ("Optolyth") ("Optolith") ("heroes")
  await copyFile ("Optolyth") ("Optolith") ("config")

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
}

app.on ("ready", main)
