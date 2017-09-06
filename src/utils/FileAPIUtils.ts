import { remote } from 'electron';
import * as fs from 'fs';
import { extname, join } from 'path';
import { ToListById } from '../types/data.d';
import { Config, RawHero, RawHerolist, RawLocale, RawTables } from '../types/rawdata.d';
import { alert } from './alert';
import { _translate, UIMessages } from './I18n';

function getAppDataPath() {
	return remote.app.getPath('userData');
}

const initialConfig: Config = {
	herolistSortOrder: 'name',
	herolistVisibilityFilter: 'all',
	racesSortOrder: 'name',
	racesValueVisibility: true,
	culturesSortOrder: 'name',
	culturesVisibilityFilter: 'common',
	culturesValueVisibility: false,
	professionsSortOrder: 'name',
	professionsVisibilityFilter: 'common',
	professionsGroupVisibilityFilter: 0,
	professionsFromExpansionsVisibility: false,
	advantagesDisadvantagesCultureRatingVisibility: false,
	talentsSortOrder: 'group',
	talentsCultureRatingVisibility: false,
	combatTechniquesSortOrder: 'name',
	specialAbilitiesSortOrder: 'group',
	spellsSortOrder: 'name',
	spellsUnfamiliarVisibility: false,
	liturgiesSortOrder: 'name',
	equipmentSortOrder: 'name',
	equipmentGroupVisibilityFilter: 1,
	enableActiveItemHints: false
};

export async function loadInitialData() {
	const appPath = getAppDataPath();
	const root = remote.app.getAppPath();
	let tables: RawTables;
	let heroes: RawHerolist;
	let config: Config;
	const locales: ToListById<RawLocale> = {};
	try {
		const result = await readFile(join(root, 'app', 'data.json'));
		tables = JSON.parse(result);
	}
	catch (error) {
		alert('Error', `The rule tables could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`);
		tables = { advantages: {}, attributes: {}, blessings: {}, cantrips: {}, combattech: {}, cultures: {}, disadvantages: {}, el: {}, items: {}, liturgies: {}, professionvariants: {}, professions: {}, races: {}, specialabilities: {}, spells: {}, talents: {}};
	}
	try {
		const result = await readFile(join(appPath, 'config.json'));
		config = { ...initialConfig, ...JSON.parse(result) };
	}
	catch (error) {
		config = initialConfig;
	}
	try {
		const result = await readFile(join(appPath, 'heroes.json'));
		heroes = JSON.parse(result);
	}
	catch (error) {
		heroes = {};
	}
	try {
		const result = await readDir(join(root, 'app', 'locales'));
		for (const file of result) {
			const locale = await readFile(join(root, 'app', 'locales', file));
			locales[file.split('.')[0]] = JSON.parse(locale);
		}
	}
	catch (error) {
		alert('Error', `The localizations could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`);
	}
	return {
		config,
		heroes,
		tables,
		locales
	};
}

export function saveConfig(data: string, locale: UIMessages) {
	const dataPath = getAppDataPath();
	const path = join(dataPath, 'config.json');

	try {
		fs.writeFileSync(path, data, { encoding: 'utf8' });
	}
	catch (error) {
		alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.saveconfig')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
	}
}

export function saveAllHeroes(data: string, locale: UIMessages) {
	const dataPath = getAppDataPath();
	const path = join(dataPath, 'heroes.json');

	try {
		fs.writeFileSync(path, data, { encoding: 'utf8' });
	}
	catch (error) {
		alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.saveheroes')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
	}
}

export async function exportHero(data: RawHero, locale: UIMessages) {
	if (data) {
		const filename = await showSaveDialog({
			title: _translate(locale, 'fileapi.exporthero.title'),
			filters: [
				{name: 'JSON', extensions: ['json']},
			],
			defaultPath: data.name.replace(/\//, '\/')
		});
		if (filename) {
			try {
				await writeFile(filename, JSON.stringify(data));
				alert(_translate(locale, 'fileapi.exporthero.success'));
			}
			catch (error) {
				alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.exporthero')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
			}
		}
	}
}

export function saveAll(config: string, heroes: string, locale: UIMessages) {
	saveConfig(config, locale);
	saveAllHeroes(heroes, locale);
}

export async function printToPDF(locale: UIMessages) {
	try {
		const data = await windowPrintToPDF({
			marginsType: 1,
			pageSize: 'A4',
			printBackground: true,
		});
		const filename = await showSaveDialog({
			title: _translate(locale, 'fileapi.printcharactersheettopdf.title'),
			filters: [
				{name: 'PDF', extensions: ['pdf']},
			],
		});
		if (filename) {
			try {
				await writeFile(filename, data);
				alert(_translate(locale, 'fileapi.printcharactersheettopdf.success'));
			}
			catch (error) {
				alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.printcharactersheettopdf')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
			}
		}
	}
	catch (error) {
		alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.printcharactersheettopdfpreparation')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
	}
}

export async function importHero(locale: UIMessages) {
	try {
		const fileNames = await showOpenDialog({
			filters: [{ name: 'JSON', extensions: ['json'] }]
		});
		if (fileNames) {
			const fileName = fileNames[0];
			if (extname(fileName) === '.json') {
				const fileContent = await readFileContent(fileName, locale);
				if (typeof fileContent === 'string') {
					return JSON.parse(fileContent);
				}
			}
		}
	}
	catch (error) {
		alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.importhero')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
	}
}

export function readFile(path: string, encoding: string = 'utf8') {
	return new Promise<string>((resolve, reject) => {
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

export async function readFileContent(path: string, locale: UIMessages, encoding: string = 'utf8') {
	try {
		return await readFile(path, encoding);
	}
	catch (error) {
		alert(_translate(locale, 'fileapi.error.title'), `${_translate(locale, 'fileapi.error.message.importhero')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`);
		return;
	}
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
