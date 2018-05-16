import { ProgressInfo } from 'builder-util-runtime';
import { ipcRenderer, remote } from 'electron';
import { UpdateInfo } from 'electron-updater';
import * as fs from 'fs';
import { extname, join } from 'path';
import { ActionTypes } from '../constants/ActionTypes';
import { getUndoAvailability } from '../selectors/currentHeroSelectors';
import { getHeroesForSave, getHeroForSave } from '../selectors/herolistSelectors';
import { getSystemLocale } from '../selectors/I18n';
import { getLocaleId, getLocaleMessages } from '../selectors/stateSelectors';
import { getUISettingsState } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { ToListById, User } from '../types/data.d';
import { Config, Raw, RawHero, RawHerolist, RawLocale, RawTables } from '../types/rawdata.d';
import { translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { bytify, readDir, readFile, showOpenDialog, showSaveDialog, windowPrintToPDF, writeFile } from '../utils/IOUtils';
import { isBase64Image } from '../utils/RegexUtils';
import { convertHero } from '../utils/VersionUtils';
import { addAlert } from './AlertActions';
import { _setTab } from './LocationActions';

function getAppDataPath(): string {
	return remote.app.getPath('userData');
}

function getRoot(): string {
	return remote.app.getAppPath();
}

export function requestClose(optionalCall?: () => void): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const safeToExit = !getUndoAvailability(state);
		const locale = getLocaleMessages(state);
		if (locale) {
			if (safeToExit) {
				dispatch(close(false, optionalCall));
			}
			else {
				// @ts-ignore
				dispatch(addAlert({
					title: translate(locale, 'heroes.warnings.unsavedactions.title'),
					message: translate(locale, 'heroes.warnings.unsavedactions.text'),
					confirm: {
						resolve: close(true, optionalCall),
						reject: _setTab('profile'),
					},
					confirmYesNo: true
				}));
			}
		}
	};
}

function close(unsaved: boolean, func?: () => void): AsyncAction {
	return async (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state)!;
		const allSaved = await dispatch(requestSaveAll());
		if (allSaved) {
			dispatch(addAlert({
				message: translate(locale, unsaved ? 'fileapi.everythingelsesaved' : 'fileapi.allsaved'),
				onClose() {
					if (func) {
						func();
					}
					remote.getCurrentWindow().close();
				}
			}));
		}
	}
}

interface ReceiveInitialDataActionPayload extends Raw {
	defaultLocale: string;
}

export interface ReceiveInitialDataAction {
	type: ActionTypes.RECEIVE_INITIAL_DATA;
	payload: ReceiveInitialDataActionPayload;
}

export function requestInitialData(): AsyncAction<Promise<void>> {
	return async dispatch => {
		const data = await dispatch(getInitialData());
		if (data) {
			dispatch(receiveInitialData(data));
		}
	};
}

export function getInitialData(): AsyncAction<Promise<Raw | undefined>> {
	return async dispatch => {
		const tables = await dispatch(getDataTables());
		const config = await dispatch(getConfig());
		const heroes = await dispatch(getHeroes());
		const locales = await dispatch(getLocale());

		if (tables && locales) {
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

function getDataTables(): AsyncAction<Promise<RawTables | undefined>> {
	return async dispatch => {
		const root = getRoot();
		try {
			const result = await readFile(join(root, 'app', 'data.json'));
			return JSON.parse(result as string) as RawTables;
		}
		catch (error) {
			dispatch(addAlert({
				message: `The rule tables could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`,
				title: 'Error'
			}));
			return;
		}
	};
}

function getConfig(): AsyncAction<Promise<Config | undefined>> {
	return async () => {
		const appPath = getAppDataPath();
		try {
			const result = await readFile(join(appPath, 'config.json'));
			return JSON.parse(result as string) as Config;
		}
		catch (error) {
			return;
		}
	};
}

function getHeroes(): AsyncAction<Promise<RawHerolist | undefined>> {
	return async () => {
		const appPath = getAppDataPath();
		try {
			const result = await readFile(join(appPath, 'heroes.json'));
			return JSON.parse(result as string) as RawHerolist;
		}
		catch (error) {
			return;
		}
	};
}

function getLocale(): AsyncAction<Promise<ToListById<RawLocale> | undefined>> {
	return async dispatch => {
		const root = getRoot();
		try {
			const result = await readDir(join(root, 'app', 'locales'));
			const locales: ToListById<RawLocale> = {};
			for (const file of result) {
				const locale = await readFile(join(root, 'app', 'locales', file));
				locales[file.split('.')[0]] = JSON.parse(locale as string);
			}
			return locales;
		}
		catch (error) {
			dispatch(addAlert({
				message: `The localizations could not be loaded. Please report this issue! (Error Code: ${JSON.stringify(error)})`,
				title: 'Error'
			}));
			return;
		}
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
		data: RawHero;
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
				message: `${translate(locale, 'fileapi.error.message.importhero')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: translate(locale, 'fileapi.error.title')
			}));
		}
		return;
	};
}

export function receiveHeroImport(raw: RawHero): ReceiveImportedHeroAction {
	const newId = `H_${getNewIdByDate()}`;
	const { player, avatar, ...other } = convertHero(raw);
	const data: RawHero = {
		...other,
		id: newId,
		avatar: avatar && (isBase64Image(avatar) || fs.existsSync(avatar.replace(/file:[\\\/]+/, ''))) ? avatar : undefined
	};
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
		let hero = getHeroForSave(state, id);
		const locale = getLocaleMessages(state)!;
		const filename = await showSaveDialog({
			title: translate(locale, 'fileapi.exporthero.title'),
			filters: [
				{name: 'JSON', extensions: ['json']},
			],
			defaultPath: hero.name.replace(/\//, '\/')
		});
		if (typeof hero.avatar === 'string' && hero.avatar.length > 0 && !isBase64Image(hero.avatar)) {
			const preparedUrl = hero.avatar.replace(/file:[\\\/]+/, '');
			if (fs.existsSync(preparedUrl)) {
				const prefix = `data:image/${extname(hero.avatar).slice(1)};base64,`;
				const file = fs.readFileSync(preparedUrl);
				const fileString = file.toString('base64');
				hero = {
					...hero,
					avatar: prefix + fileString
				};
			}
		}
		if (filename) {
			try {
				await writeFile(filename, JSON.stringify(hero));
				dispatch(addAlert({
					message: translate(locale, 'fileapi.exporthero.success')
				}));
			}
			catch (error) {
				dispatch(addAlert({
					message: `${translate(locale, 'fileapi.error.message.exporthero')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
					title: translate(locale, 'fileapi.error.title')
				}));
			}
		}
	};
}

export function requestConfigSave(): AsyncAction<Promise<boolean>> {
	return async (dispatch, getState) => {
		const state = getState();
		const data: Config = {
			...getUISettingsState(state),
			locale: getLocaleId(state)
		};
		const locale = getLocaleMessages(state)!;
		const dataPath = getAppDataPath();
		const path = join(dataPath, 'config.json');

		try {
			await writeFile(path, JSON.stringify(data));
			return true;
		}
		catch (error) {
			dispatch(addAlert({
				message: `${translate(locale, 'fileapi.error.message.saveconfig')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: translate(locale, 'fileapi.error.title')
			}));
			return false;
		}
	};
}

export function requestHeroesSave(): AsyncAction<Promise<boolean>> {
	return async (dispatch, getState) => {
		const state = getState();
		const data = getHeroesForSave(state);
		const locale = getLocaleMessages(state)!;
		const dataPath = getAppDataPath();
		const path = join(dataPath, 'heroes.json');

		try {
			await writeFile(path, JSON.stringify(data));
			return true;
		}
		catch (error) {
			dispatch(addAlert({
				message: `${translate(locale, 'fileapi.error.message.saveconfig')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: translate(locale, 'fileapi.error.title')
			}));
			return false;
		}
	};
}

export function requestSaveAll(): AsyncAction<Promise<boolean>> {
	return async dispatch => {
		const configSavedDone = await dispatch(requestConfigSave());
		const heroesSavedDone = await dispatch(requestHeroesSave());
		return configSavedDone && heroesSavedDone;
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
				title: translate(locale, 'fileapi.printcharactersheettopdf.title'),
				filters: [
					{name: 'PDF', extensions: ['pdf']},
				],
			});
			if (filename) {
				try {
					await writeFile(filename, data);
					dispatch(addAlert({
						message: translate(locale, 'fileapi.printcharactersheettopdf.success')
					}));
				}
				catch (error) {
					dispatch(addAlert({
						message: `${translate(locale, 'fileapi.error.message.printcharactersheettopdf')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
						title: translate(locale, 'fileapi.error.title')
					}));
				}
			}
		}
		catch (error) {
			dispatch(addAlert({
				message: `${translate(locale, 'fileapi.error.message.printcharactersheettopdfpreparation')} (${translate(locale, 'fileapi.error.message.code')}: ${JSON.stringify(error)})`,
				title: translate(locale, 'fileapi.error.title')
			}));
		}
	};
}

export function updateAvailable(info: UpdateInfo): AsyncAction {
	return async (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state)!;
		// @ts-ignore
		dispatch(addAlert({
			message: info.files[0] && info.files[0].size ? translate(locale, 'newversionavailable.messagewithsize', info.version, bytify(info.files[0].size!, locale.id)) : translate(locale, 'newversionavailable.message', info.version),
			title: translate(locale, 'newversionavailable.title'),
			buttons: [
				{
					label: translate(locale, 'newversionavailable.update'),
					dispatchOnClick: (dispatch => {
						dispatch(setUpdateDownloadProgress({
							total: 0,
							delta: 0,
							transferred: 0,
							percent: 0,
							bytesPerSecond: 0
						}));
						ipcRenderer.send('download-update');
					}) as AsyncAction
				},
				{
					label: translate(locale, 'cancel')
				}
			]
		}));
	};
}

export function updateNotAvailable(): AsyncAction {
	return async (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state)!;
		dispatch(addAlert({
			message: translate(locale, 'nonewversionavailable.message'),
			title: translate(locale, 'nonewversionavailable.title')
		}));
	};
}

export interface SetUpdateDownloadProgressAction {
	type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS;
	payload?: ProgressInfo;
}

export function setUpdateDownloadProgress(info?: ProgressInfo): SetUpdateDownloadProgressAction {
	return {
		type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS,
		payload: info
	};
}
