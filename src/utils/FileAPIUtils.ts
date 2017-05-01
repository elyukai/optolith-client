import { remote } from 'electron';
import * as fs from 'fs';
import { join } from 'path';
import * as FileActions from '../actions/FileActions';
import { CombatTechniquesStore } from '../stores/CombatTechniquesStore';
import { ConfigStore } from '../stores/ConfigStore';
import { CultureStore } from '../stores/CultureStore';
import { DisAdvStore } from '../stores/DisAdvStore';
import { EquipmentStore } from '../stores/EquipmentStore';
import { HerolistStore } from '../stores/HerolistStore';
import { LiturgiesStore } from '../stores/LiturgiesStore';
import { LocaleStore } from '../stores/LocaleStore';
import { ProfessionStore } from '../stores/ProfessionStore';
import { RaceStore } from '../stores/RaceStore';
import { SheetStore } from '../stores/SheetStore';
import { SpecialAbilitiesStore } from '../stores/SpecialAbilitiesStore';
import { SpellsStore } from '../stores/SpellsStore';
import { TalentsStore } from '../stores/TalentsStore';
import { ToListById } from '../types/data.d';
import { Config, RawHerolist, RawLocale, RawTables } from '../types/rawdata.d';
import { alert } from './alert';

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
	culturesValueVisibility: true,
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
		const result = await readFile(join(root, 'resources/data.json'));
		tables = JSON.parse(result);
	}
	catch (error) {
		alert('Fehler', `Bei der Laden der Regeln ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
		tables = { adv: {}, attributes: {}, blessings: {}, cantrips: {}, combattech: {}, cultures: {}, disadv: {}, el: {}, items: {}, liturgies: {}, professionVariants: {}, professions: {}, races: {}, specialabilities: {}, spells: {}, talents: {}};
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
		const result = await readDir(join(root, 'resources/locales'));
		for (const file of result) {
			const locale = await readFile(join(root, 'resources/locales', file));
			locales[file.split('.')[0]] = JSON.parse(locale);
		}
	}
	catch (error) {
		alert('Fehler', `Bei der Laden der Lokalisierungen ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
	}
	const initialData = {
		config,
		heroes,
		tables,
		locales
	};
	FileActions.receiveInitialData(initialData);
}

export function saveConfig() {
	const dataPath = getAppDataPath();
	const path = join(dataPath, 'config.json');
	const data: Config = {
		herolistSortOrder: HerolistStore.getSortOrder(),
		herolistVisibilityFilter: HerolistStore.getView(),
		racesSortOrder: RaceStore.getSortOrder(),
		racesValueVisibility: RaceStore.areValuesVisible(),
		culturesSortOrder: CultureStore.getSortOrder(),
		culturesVisibilityFilter: CultureStore.areAllVisible(),
		culturesValueVisibility: CultureStore.areValuesVisible(),
		professionsSortOrder: ProfessionStore.getSortOrder(),
		professionsVisibilityFilter: ProfessionStore.getVisibilityFilter(),
		professionsGroupVisibilityFilter: ProfessionStore.getGroupVisibilityFilter(),
		professionsFromExpansionsVisibility: ProfessionStore.getExpansionVisibilityFilter(),
		advantagesDisadvantagesCultureRatingVisibility: DisAdvStore.getRating(),
		talentsSortOrder: TalentsStore.getSortOrder(),
		talentsCultureRatingVisibility: TalentsStore.isRatingVisible(),
		combatTechniquesSortOrder: CombatTechniquesStore.getSortOrder(),
		specialAbilitiesSortOrder: SpecialAbilitiesStore.getSortOrder(),
		spellsSortOrder: SpellsStore.getSortOrder(),
		spellsUnfamiliarVisibility: false,
		liturgiesSortOrder: LiturgiesStore.getSortOrder(),
		equipmentSortOrder: EquipmentStore.getSortOrder(),
		equipmentGroupVisibilityFilter: 1,
		...SheetStore.getForSave(),
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility(),
		locale: LocaleStore.getForSave()
	};

	try {
		fs.writeFileSync(path, JSON.stringify(data), { encoding: 'utf8' });
	}
	catch (error) {
		alert('Fehler', `Beim Speichern der Anwendungskonfiguration ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
	}
}

export function saveAllHeroes() {
	const dataPath = getAppDataPath();
	const path = join(dataPath, 'heroes.json');
	const data = HerolistStore.getAllForSave();

	try {
		fs.writeFileSync(path, JSON.stringify(data), { encoding: 'utf8' });
	}
	catch (error) {
		alert('Fehler', `Beim Speichern der Helden ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
	}
}

export async function saveHero(id: string) {
	const currentWindow = remote.getCurrentWindow();
	const data = HerolistStore.getForSave(id);
	const filename = await showSaveDialog(currentWindow, {
		title: 'Held als JSON speichern',
		filters: [
			{name: 'JSON', extensions: ['json']},
		],
		defaultPath: data.name.replace(/\//, '\/')
	});
	if (filename) {
		try {
			await writeFile(filename, JSON.stringify(data));
			alert('Held gespeichert');
		}
		catch (error) {
			alert('Fehler', `Beim Speichern der Datei ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
		}
	}
}

export function saveAll() {
	saveConfig();
	saveAllHeroes();
}

export async function printToPDF() {
	const currentWindow = remote.getCurrentWindow();
	try {
		const data = await windowPrintToPDF(currentWindow, {
			marginsType: 1,
			pageSize: 'A4',
			printBackground: true,
		});
		const filename = await showSaveDialog(currentWindow, {
			title: 'Heldendokument als PDF speichern',
			filters: [
				{name: 'PDF', extensions: ['pdf']},
			],
		});
		if (filename) {
			try {
				await writeFile(filename, data);
				alert('PDF gespeichert');
			}
			catch (error) {
				alert('Fehler', `Beim Speichern der PDF ist ein Fehler aufgetreten. Überprüfe, ob, wenn du hiermit eine alte PDF überschreibst, du diese alte PDF nicht irgendwo geöffnet hast, denn solange sie geöffnet ist, kann sie nicht überschrieben werden! Falls es immer noch nicht gelingen sollte, informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
			}
		}
	}
	catch (error) {
		alert('Fehler', `Bei der Generierung der PDF ist ein Fehler aufgetreten. Versuche es noch einmal. Falls es immer noch nicht gelingen sollte, informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
	}
}

export async function importHero(path: string) {
	try {
		const result = await readFile(path);
		FileActions.receiveImportedHero(JSON.parse(result));
	}
	catch (error) {
		alert('Fehler', `Bei der Laden der Datei ist ein Fehler aufgetreten. (Fehler: ${JSON.stringify(error)})`);
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
export function windowPrintToPDF(window: Electron.BrowserWindow, options: Electron.PrintToPDFOptions) {
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
export function showSaveDialog(window: Electron.BrowserWindow, options: Electron.SaveDialogOptions) {
	return new Promise<string | undefined>(resolve => {
		remote.dialog.showSaveDialog(window, options, filename => {
			resolve(filename);
		});
	});
}
