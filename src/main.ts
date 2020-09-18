import { app, BrowserWindow, ipcMain } from "electron"
import * as log from "electron-log"
import { autoUpdater, CancellationToken, UpdateInfo } from "electron-updater"
import windowStateKeeper from "electron-window-state"
import { promises } from "fs"
import * as path from "path"
import { prerelease } from "semver"
import * as url from "url"
import { isUpdaterEnabled } from "./App/Utilities/CheckForUpdatesMain"
import { existsFile } from "./System/IO"

app.setAppUserModelId ("lukasobermann.optolith")
app.allowRendererProcessReuse = false

const setDerivedUserDataPath = async () => {
  const isPrerelease = prerelease (app.getVersion ()) !== null

  const userDataPath =
    path.join (app.getPath ("appData"), isPrerelease ? "Optolith Insider" : "Optolith")

  if (!await existsFile (userDataPath)) {
    await promises.mkdir (userDataPath)
  }

  app.setPath ("userData", userDataPath)
}

const createWindow = async () => {
  const mainWindowState = windowStateKeeper ({
    defaultHeight: 720,
    defaultWidth: 1280,
    file: "window.json",
  })

  const mainWindow = new BrowserWindow ({
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
    backgroundColor: "#111111",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join (app.getAppPath (), "app", "esmPreload.js"),
    },
  })

  mainWindowState.manage (mainWindow)

  try {
    await mainWindow.loadURL (url.format ({
      pathname: path.join (__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }))

    // mainWindow.webContents.openDevTools ()

    mainWindow.show ()

    if (mainWindowState.isMaximized) {
      mainWindow.maximize ()
    }

    ipcMain.addListener ("loading-done", () => {
      let cancellationToken: CancellationToken | undefined = undefined

      if (isUpdaterEnabled ()) {
        autoUpdater
          .checkForUpdates ()
          .then (res => {
            if (res.cancellationToken !== undefined) {
              const { cancellationToken: token } = res
              cancellationToken = token
              mainWindow.webContents.send ("update-available", res.updateInfo)
            }
          })
          .catch (() => {})

        autoUpdater.addListener ("update-available", (info: UpdateInfo) => {
          mainWindow.webContents.send ("update-available", info)
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
                mainWindow.webContents.send ("update-not-available")
              }
              else {
                cancellationToken = token
                mainWindow.webContents.send ("update-available", res.updateInfo)
              }
            })
            .catch (() => {})
        })

        autoUpdater.signals.progress (progressObj => {
          mainWindow.webContents.send ("download-progress", progressObj)
        })

        autoUpdater.addListener ("error", (err: Error) => {
          mainWindow.webContents.send ("auto-updater-error", err)
        })

        autoUpdater.signals.updateDownloaded (() => {
          autoUpdater.quitAndInstall ()
        })
      }
    })
  }
  catch (err) {
    console.error (err)
  }
}

const main = () => {
  autoUpdater.logger = log
  // @ts-ignore
  autoUpdater.logger.transports.file.level = "info"
  autoUpdater.autoDownload = false

  // install dev extensions
  const edi = require ("electron-devtools-installer")
  edi.default ([
    edi.REACT_DEVELOPER_TOOLS,
    edi.REDUX_DEVTOOLS,
  ])

  setDerivedUserDataPath ()
    .then (createWindow)
    .then (() => {
      app.on ("window-all-closed", () => {
        app.quit ()
      })
    })
    .catch (console.error)
}

app.on ("ready", main)
