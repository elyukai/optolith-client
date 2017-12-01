import { remote } from 'electron';
import * as fs from 'fs';

export function readFile(path: string, encoding: string = 'utf8') {
	return new Promise<string | Buffer>((resolve, reject) => {
		fs.readFile(path, encoding, (error, data) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(data);
			}
		});
	});
}

export function readDir(path: string) {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(path, (error, data) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(data);
			}
		});
	});
}

export function writeFile(path: string, data: any) {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(path, data, error => {
			if (error) {
				reject(error);
			}
			else {
				resolve();
			}
		});
	});
}

/**
 * Prints windows' web page as PDF with Chromium's preview printing custom settings.
 */
export function windowPrintToPDF(options: Electron.PrintToPDFOptions, window: Electron.BrowserWindow = remote.getCurrentWindow()) {
	return new Promise<Buffer>((resolve, reject) => {
		window.webContents.printToPDF(options, (error, data) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(data);
			}
		});
	});
}

/**
 * Shows a native save dialog.
 */
export function showSaveDialog(options: Electron.SaveDialogOptions, window: Electron.BrowserWindow = remote.getCurrentWindow()) {
	return new Promise<string | undefined>(resolve => {
		remote.dialog.showSaveDialog(window, options, filename => {
			resolve(filename);
		});
	});
}

/**
 * Shows a native open dialog.
 */
export function showOpenDialog(options: Electron.OpenDialogOptions, window: Electron.BrowserWindow = remote.getCurrentWindow()) {
	return new Promise<string[] | undefined>(resolve => {
		remote.dialog.showOpenDialog(window, options, filenames => {
			if (filenames) {
				resolve(filenames);
			}
			resolve();
		});
	});
}

export function getSystemLocale() {
	return remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US';
}

const byteTags = ['', 'K', 'M', 'G', 'T'];

export function bytify(number: number, localeId: string) {
	let tier = 0;

	while (number > 1023 && tier < byteTags.length) {
		tier++;
		number /= 1024;
	}

	return `${(Math.round(number * 10) / 10).toLocaleString(localeId)} ${byteTags[tier]}B`;
}
