import { remote } from 'electron';
import { existsSync } from 'fs';
import { extname, join } from 'path';
import * as ActionTypes from '../constants/ActionTypes';
import { getUndoAvailability } from '../selectors/currentHeroSelectors';
import { getHeroesForSave, getHeroForSave } from '../selectors/herolistSelectors';
import { getSystemLocale } from '../selectors/I18n';
import { getLocaleId, getLocaleMessages } from '../selectors/stateSelectors';
import { getUISettingsState } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { Hero, ToListById, User } from '../types/data.d';
import { Config, Raw, RawHero, RawHerolist, RawLocale, RawTables } from '../types/rawdata.d';
import { _translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { readDir, readFile, showOpenDialog, showSaveDialog, windowPrintToPDF, writeFile } from '../utils/IOUtils';
import { convertHero } from '../utils/VersionUtils';
import { addAlert } from './AlertActions';
import { _setSection } from './LocationActions';

function getAppDataPath(): string {
	return remote.app.getPath('userData');
}

export function requestClose(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const safeToExit = !getUndoAvailability(state);
		const locale = getLocaleMessages(state);
		if (locale) {
			if (safeToExit) {
				dispatch(requestSaveAll());
				dispatch(addAlert({
					message: _translate(locale, 'fileapi.allsaved'),
					onClose() {
						remote.getCurrentWindow().close();
					}
				}));
			}
			else {
				dispatch(addAlert({
					title: _translate(locale, 'heroes.warnings.unsavedactions.title'),
					message: _translate(locale, 'heroes.warnings.unsavedactions.text'),
					confirm: [
						((dispatch: any) => {
							dispatch(requestSaveAll());
							dispatch(addAlert({
								message: _translate(locale, 'fileapi.everythingelsesaved'),
								onClose() {
									remote.getCurrentWindow().close();
								}
							}));
						}) as any,
						_setSection('hero')
					],
					confirmYesNo: true
				}));
			}
		}
	};
}

interface ReceiveInitialDataActionPayload extends Raw {
	defaultLocale: string;
}

export interface ReceiveInitialDataAction {
	type: ActionTypes.RECEIVE_INITIAL_DATA;
	payload: ReceiveInitialDataActionPayload;
}

export function requestInitialData(): AsyncAction {
	return async dispatch => {
		const data = await dispatch(getInitialData());
		if (data) {
			dispatch(receiveInitialData(data));
		}
	};
}

export function getInitialData(): AsyncAction<Promise<Raw | undefined>> {
	return async dispatch => {
		const appPath = getAppDataPath();
		const root = remote.app.getAppPath();
		let tables: RawTables | undefined;
		let config: Config | undefined;
		let heroes: RawHerolist | undefined;
		let locales: ToListById<RawLocale> | undefined;
		try {
			const result = await readFile(join(root, 'app', 'data.json'));
			tables = JSON.parse(result);
		}
		catch (error) {
			dispatch(addAlert({
				message: `The rule tables could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`,
				title: 'Error'
			}));
		}
		try {
			const result = await readFile(join(appPath, 'config.json'));
			config = JSON.parse(result);
		}
		catch (error) {
			config = undefined;
		}
		try {
			const result = await readFile(join(appPath, 'heroes.json'));
			heroes = JSON.parse(result);
		}
		catch (error) {
			heroes = undefined;
		}
		try {
			const result = await readDir(join(root, 'app', 'locales'));
			locales = {};
			for (const file of result) {
				const locale = await readFile(join(root, 'app', 'locales', file));
				locales[file.split('.')[0]] = JSON.parse(locale);
			}
		}
		catch (error) {
			dispatch(addAlert({
				message: `The localizations could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`,
				title: 'Error'
			}));
		}
		if (tables && heroes && locales) {
			return {
				tables,
				heroes,
				locales,
				config,
			};
		}
		return;
	};
}

export function receiveInitialData(data: Raw): ReceiveInitialDataAction {
	return {
		type: ActionTypes.RECEIVE_INITIAL_DATA,
		payload: {
			...data,
			defaultLocale: getSystemLocale()
		}
	};
}

export interface ReceiveImportedHeroAction {
	type: ActionTypes.RECEIVE_IMPORTED_HERO;
	payload: {
		data: Hero;
		player?: User;
	};
}

export function requestHeroImport(): AsyncAction {
	return async dispatch => {
		const data = await dispatch(getHeroImport());
		if (data) {
			dispatch(receiveHeroImport(data));
		}
	};
}

export function getHeroImport(): AsyncAction<Promise<RawHero | undefined>> {
	return async (dispatch, getState) => {
		const locale = getLocaleMessages(getState())!;
		try {
			const fileNames = await showOpenDialog({
				filters: [{ name: 'JSON', extensions: ['json'] }]
			});
			if (fileNames) {
				const fileName = fileNames[0];
				if (extname(fileName) === '.json') {
					const fileContent = await readFile(fileName);
					if (typeof fileContent === 'string') {
						return JSON.parse(fileContent);
					}
				}
			}
		}
		catch (error) {
			dispatch(addAlert({
				message: `${_translate(locale, 'fileapi.error.message.importhero')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: _translate(locale, 'fileapi.error.title')
			}));
		}
		return;
	};
}

export function receiveHeroImport(raw: RawHero): ReceiveImportedHeroAction {
	const newId = `H_${getNewIdByDate()}`;
	const { player, avatar, dateCreated, dateModified, ...other } = raw;
	const data: Hero = convertHero({
		...other,
		id: newId,
		dateCreated: new Date(dateCreated),
		dateModified: new Date(dateModified),
		avatar: avatar && existsSync(avatar.replace(/file:[\\\/]+/, '')) ? avatar : undefined
	});
	return {
		type: ActionTypes.RECEIVE_IMPORTED_HERO,
		payload: {
			data,
			player
		}
	};
}

export function requestHeroExport(id: string): AsyncAction {
	return async (dispatch, getState) => {
		const state = getState();
		const hero = getHeroForSave(state, id);
		const locale = getLocaleMessages(state)!;
		const filename = await showSaveDialog({
			title: _translate(locale, 'fileapi.exporthero.title'),
			filters: [
				{name: 'JSON', extensions: ['json']},
			],
			defaultPath: hero.name.replace(/\//, '\/')
		});
		if (filename) {
			try {
				await writeFile(filename, JSON.stringify(hero));
				dispatch(addAlert({
					message: _translate(locale, 'fileapi.exporthero.success')
				}));
			}
			catch (error) {
				dispatch(addAlert({
					message: `${_translate(locale, 'fileapi.error.message.exporthero')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
					title: _translate(locale, 'fileapi.error.title')
				}));
			}
		}
	};
}

export function requestConfigSave(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const data: Config = {
			...getUISettingsState(state),
			locale: getLocaleId(state)
		};
		const locale = getLocaleMessages(state)!;
		const dataPath = getAppDataPath();
		const path = join(dataPath, 'config.json');

		try {
			writeFile(path, JSON.stringify(data));
		}
		catch (error) {
			dispatch(addAlert({
				message: `${_translate(locale, 'fileapi.error.message.saveconfig')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: _translate(locale, 'fileapi.error.title')
			}));
		}
	};
}

export function requestHeroesSave(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const data = getHeroesForSave(state);
		const locale = getLocaleMessages(state)!;
		const dataPath = getAppDataPath();
		const path = join(dataPath, 'heroes.json');

		try {
			writeFile(path, JSON.stringify(data));
		}
		catch (error) {
			dispatch(addAlert({
				message: `${_translate(locale, 'fileapi.error.message.saveconfig')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: _translate(locale, 'fileapi.error.title')
			}));
		}
	};
}

export function requestSaveAll(): AsyncAction {
	return dispatch => {
		dispatch(requestConfigSave());
		dispatch(requestHeroesSave());
	};
}

export function requestPrintHeroToPDF(): AsyncAction {
	return async (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state)!;
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
					dispatch(addAlert({
						message: _translate(locale, 'fileapi.printcharactersheettopdf.success')
					}));
				}
				catch (error) {
					dispatch(addAlert({
						message: `${_translate(locale, 'fileapi.error.message.printcharactersheettopdf')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
						title: _translate(locale, 'fileapi.error.title')
					}));
				}
			}
		}
		catch (error) {
			dispatch(addAlert({
				message: `${_translate(locale, 'fileapi.error.message.printcharactersheettopdfpreparation')} (${_translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: _translate(locale, 'fileapi.error.title')
			}));
		}
	};
}
