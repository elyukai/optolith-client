const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		resizable: false,
		icon: path.join(app.getAppPath(), 'resources/favicon.png'),
		frame: false,
		center: true,
		title: 'DSA5 Heldentool',
		titleBarStyle: 'hidden',
		show: false
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// mainWindow.webContents.openDevTools();

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	})

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.setAppUserModelId('lukasobermann.tdeheroes');

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
