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
  console.log ("main (window): Initialize window state keeper")

  const mainWindowState = windowStateKeeper ({
    defaultHeight: 720,
    defaultWidth: 1280,
    file: "window.json",
  })

  console.log ("main (window): Initialize browser window")

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
      // preload: path.join (app.getAppPath (), "app", "esmPreload.js"),
      enableRemoteModule: true,
    },
  })

  console.log ("main (window): Manage browser window with state keeper")

  mainWindowState.manage (mainWindow)

  try {
    console.log ("main (window): Load url")

    await mainWindow.loadURL (url.format ({
      pathname: path.join (__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }))

    // mainWindow.webContents.openDevTools ()

    console.log ("main (window): Show window")

    mainWindow.show ()

    if (mainWindowState.isMaximized) {
      console.log ("main (window): Maximize window ...")

      mainWindow.maximize ()
    }

    ipcMain.addListener ("loading-done", () => {
      let cancellationToken: CancellationToken | undefined = undefined

      if (isUpdaterEnabled ()) {
        console.log ("main: Updater is enabled, check for updates ...")

        autoUpdater
          .checkForUpdates ()
          .then (res => {
            if (res.cancellationToken === undefined) {
              console.log ("main: No update available")
            }
            else {
              const { cancellationToken: token } = res
              cancellationToken = token
              console.log ("main: Update is available")
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
      else {
        console.log ("main: Updater is not available")
      }
    })
  }
  catch (err) {
    console.error (err)
  }
}

const main = async () => {
  autoUpdater.logger = log
  // @ts-ignore
  autoUpdater.logger.transports.file.level = "info"
  autoUpdater.autoDownload = false

  console.log ("main: Set user data path ...")

  await setDerivedUserDataPath ()

  console.log ("main: Install extensions ...")

  const installExtension = require ("electron-devtools-installer")

  const installedExtensions = await installExtension.default ([
    installExtension.REACT_DEVELOPER_TOOLS,
    installExtension.REDUX_DEVTOOLS,
  ])

  console.log (`main: Installed extensions: ${installedExtensions}`)

  console.log ("main: Create Window ...")

  await createWindow ()

  app.on ("window-all-closed", () => {
    app.quit ()
  })
}

// app.on("ready") expects a callback that returns void and not a Promise
const mainVoid = () => {
  main () .catch (console.error)
}

app.on ("ready", mainVoid)
