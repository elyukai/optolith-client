<<<<<<< HEAD
import { app, BrowserWindow, ipcMain } from "electron";
import * as log from "electron-log";
// tslint:disable-next-line:no-implicit-dependencies
import { autoUpdater, CancellationToken, UpdateInfo } from "electron-updater";
import * as path from "path";
import { prerelease } from "semver";
import * as url from "url";
import { pipe_ } from "./App/Utilities/pipe";
import { tryIO } from "./Control/Exception";
import { fromLeft_, isLeft } from "./Data/Either";
import { fmap } from "./Data/Functor";
import { Unit } from "./Data/Unit";
import { existsFile, IO, join, liftM2, runIO, thenF } from "./System/IO";
// tslint:disable-next-line:ordered-imports
import windowStateKeeper = require("electron-window-state")

let mainWindow: Electron.BrowserWindow | null | undefined

app.setAppUserModelId ("lukasobermann.optolith")
app.commandLine.appendSwitch ("flags", "--experimental-modules")

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
    const originPath = path.join (originFolder, `${fileName}`)
    const destPath = path.join (destFolder, `${fileName}`)

    return join (liftM2 ((origin_exists: boolean) => (dest_exists: boolean) =>
                          !dest_exists && origin_exists
                            ? IO.copyFile (originPath) (destPath)
                            : IO.pure (undefined))
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
=======
import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import * as log from 'electron-log';
import { UpdateInfo, autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import windowStateKeeper = require('electron-window-state');

let mainWindow: Electron.BrowserWindow | null | undefined;

app.setAppUserModelId('lukasobermann.optolith');

const userDataPath = app.getPath('userData');

const accessPromise =
  (path: string) =>
    new Promise<boolean> (resolve => {
      fs.access (path, err => {
        if (err) {
          resolve(false)
        }

        resolve(true)
      })
    })

const copyFile =
  (oldFolder: string) =>
  (newFolder: string) =>
  async (fileName: string) => {
    const newJSONPath = path.join(userDataPath, '..', newFolder, `${fileName}.json`)
    const hasNewJSON = await accessPromise(newJSONPath)

    const oldJSONPath = path.join(userDataPath, '..', oldFolder, `${fileName}.json`)
    const hasOldJSON = await accessPromise(oldJSONPath)

    if (!hasNewJSON && hasOldJSON) {
      try {
        fs.createReadStream (oldJSONPath) .pipe (fs.createWriteStream (newJSONPath))
      }
      catch (err) {
        log.error(`Could not load or read ${fileName}.json (${err})`)
      }
    }

    return
  }

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultHeight: 720,
    defaultWidth: 1280,
    file: 'window.json'
  });

  mainWindow = new BrowserWindow({
>>>>>>> develop
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    minHeight: 720,
    minWidth: 1280,
    resizable: true,
<<<<<<< HEAD
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
    .then (() => {
      // mainWindow!.webContents.openDevTools ()

      mainWindow!.show ()

      if (mainWindowState.isMaximized) {
        mainWindow!.maximize ()
      }

      ipcMain.addListener ("loading-done", () => {
        let cancellationToken: CancellationToken | undefined

        autoUpdater
          .checkForUpdates ()
          .then (res => {
            if (res.cancellationToken !== undefined) {
              cancellationToken = res.cancellationToken
              mainWindow!.webContents.send ("update-available", res.updateInfo)
            }
          })
          .catch ()

        autoUpdater.addListener ("update-available", (info: UpdateInfo) => {
          mainWindow!.webContents.send ("update-available", info)
          autoUpdater.removeAllListeners ("update-not-available")
        })

        ipcMain.addListener ("download-update", () => {
          autoUpdater
            .downloadUpdate (cancellationToken)
            .catch ()
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
            .catch ()
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
    .catch (err => { console.error (err) })

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
  (copy: (fileName: string) => IO<void>) =>
    pipe_ (
      copy ("window.json"),
      tryIO,
      fmap (x => isLeft (x) ? (console.warn (fromLeft_ (x)), Unit) : Unit),
      thenF (copy ("heroes.json")),
      tryIO,
      fmap (x => isLeft (x) ? (console.warn (fromLeft_ (x)), Unit) : Unit),
      thenF (copy ("config.json")),
      tryIO,
      fmap (x => isLeft (x) ? (console.warn (fromLeft_ (x)), Unit) : Unit)
    )

function main () {
  if (prerelease (require ("../package.json") .version) !== null) {
    pipe_ (
      copyAllFiles (copyFileFromToFolder ("Optolyth") ("Optolith")),
      thenF (copyAllFiles (copyFileToCurrent ("Optolith"))),
      fmap (openMainWindow),
      runIO
    )
  }
  else {
    pipe_ (
      copyAllFiles (copyFileToCurrent ("Optolyth")),
      fmap (openMainWindow),
      runIO
    )
  }
=======
    icon: path.join(app.getAppPath(), 'app', 'icon.png'),
    frame: false,
    center: true,
    title: 'Optolith',
    acceptFirstMouse: true,
    backgroundColor: '#000000',
    show: false,
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
    if (mainWindowState.isMaximized) {
      mainWindow!.maximize();
    }

    ipcMain.addListener('loading-done', () => {
      if (process.platform !== 'linux') {
        autoUpdater.checkForUpdates();

        autoUpdater.addListener('update-available', (info: UpdateInfo) => {
          mainWindow!.webContents.send('update-available', info);
          autoUpdater.removeAllListeners('update-not-available');
        });

        ipcMain.addListener('download-update', () => {
          autoUpdater.downloadUpdate();
        });

        ipcMain.addListener('check-for-updates', () => {
          autoUpdater.checkForUpdates();
          autoUpdater.once('update-not-available', () => {
            mainWindow!.webContents.send('update-not-available');
          });
        });

        autoUpdater.signals.progress(progressObj => {
          mainWindow!.webContents.send('download-progress', progressObj);
        });

        autoUpdater.addListener('error', (err: Error) => {
          mainWindow!.webContents.send('auto-updater-error', err);
        });

        autoUpdater.signals.updateDownloaded(() => {
          autoUpdater.quitAndInstall();
        });
      }
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    globalShortcut.unregisterAll();
  });
}

async function main() {
  await copyFile ('TDE5 Heroes') ('Optolyth') ('window')
  await copyFile ('Optolyth') ('Optolith') ('window')
  await copyFile ('TDE5 Heroes') ('Optolyth') ('heroes')
  await copyFile ('Optolyth') ('Optolith') ('heroes')
  await copyFile ('TDE5 Heroes') ('Optolyth') ('config')
  await copyFile ('Optolyth') ('Optolith') ('config')

  autoUpdater.logger = log;
  // @ts-ignore
  autoUpdater.logger.transports.file.level = 'info';
  autoUpdater.autoDownload = false;

  createWindow();

  app.on('window-all-closed', () => {
    app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
>>>>>>> develop
}

app.on ("ready", main)
