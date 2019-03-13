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
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    minHeight: 720,
    minWidth: 1280,
    resizable: true,
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
}

app.on('ready', main);
