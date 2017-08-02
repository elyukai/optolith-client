import { app, BrowserWindow } from 'electron';
import windowStateKeeper = require('electron-window-state');
import * as path from 'path';
import * as url from 'url';

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
		icon: path.join(app.getAppPath(), 'app', 'favicon.png'),
		frame: false,
		center: true,
		title: 'TDE Heroes',
		titleBarStyle: 'hidden',
		acceptFirstMouse: true,
		backgroundColor: '#000000',
		// webPreferences: {
		// 	devTools: false
		// },
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
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.setAppUserModelId('lukasobermann.tdeheroes');

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
