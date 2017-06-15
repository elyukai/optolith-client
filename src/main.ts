import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow | null | undefined;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		resizable: false,
		icon: path.join(app.getAppPath(), 'app', 'favicon.png'),
		frame: false,
		center: true,
		title: 'DSA5 Heldentool',
		titleBarStyle: 'hidden',
		acceptFirstMouse: true,
		backgroundColor: '#010a13',
		// webPreferences: {
		// 	devTools: false
		// },
		show: false
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// mainWindow.webContents.openDevTools();

	mainWindow.once('ready-to-show', () => {
		mainWindow!.show();
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
