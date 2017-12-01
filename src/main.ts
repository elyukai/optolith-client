import { app, BrowserWindow, ipcMain } from 'electron';
import * as log from 'electron-log';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import windowStateKeeper = require('electron-window-state');
import * as path from 'path';
import * as url from 'url';

app.setAppUserModelId('lukasobermann.optolyth');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

autoUpdater.autoDownload = false;

let mainWindow: Electron.BrowserWindow | null | undefined;

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
		title: 'TDE Heroes',
		acceptFirstMouse: true,
		backgroundColor: '#000000',
		show: false
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

		if (process.platform !== 'linux') {
			autoUpdater.checkForUpdates();

			autoUpdater.addListener('update-available', (info: UpdateInfo) => {
				mainWindow!.webContents.send('update-available', info);
			});

			ipcMain.addListener('download-update', () => {
				autoUpdater.downloadUpdate();
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

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
