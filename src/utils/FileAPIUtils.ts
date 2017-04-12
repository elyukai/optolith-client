import { remote } from 'electron';
import { readFile, writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import * as FileActions from '../actions/FileActions';
import * as ServerActions from '../actions/ServerActions';
import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import CultureStore from '../stores/CultureStore';
import DisAdvStore from '../stores/DisAdvStore';
import EquipmentStore from '../stores/EquipmentStore';
import HerolistStore from '../stores/HerolistStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import ProfessionStore from '../stores/ProfessionStore';
import RaceStore from '../stores/RaceStore';
import SpecialAbilitiesStore from '../stores/SpecialAbilitiesStore';
import SpellsStore from '../stores/SpellsStore';
import TalentsStore from '../stores/TalentsStore';
import alert from './alert';

function getAppDataPath() {
	return remote.app.getPath('userData');
}

const initialConfig = {
	herolistSortOrder: 'name',
	herolistVisibilityFilter: 'all',
	racesSortOrder: 'name',
	racesValueVisibility: true,
	culturesSortOrder: 'name',
	culturesVisibilityFilter: 'common',
	culturesValueVisibility: true,
	professionsSortOrder: 'name',
	professionsVisibilityFilter: 'common',
	professionsFromExpansionsVisibility: false,
	advantagesDisadvantagesCultureRatingVisibility: true,
	talentsSortOrder: 'group',
	talentsCultureRatingVisibility: true,
	combatTechniquesSortOrder: 'name',
	specialAbilitiesSortOrder: 'group',
	spellsSortOrder: 'name',
	spellsUnfamiliarVisibility: false,
	liturgiesSortOrder: 'name',
	equipmentSortOrder: 'name',
	equipmentGroupVisibilityFilter: 1,
};

export function loadInitialData() {
	const appPath = getAppDataPath();
	readFile(join(remote.app.getAppPath(), 'resources/data.json'), 'utf8', (error, data) => {
		if (error) {
			alert('Fehler', `Bei der Laden der Regeln ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
		}
		else {
			const tables = JSON.parse(data);
			const configPath = join(appPath, 'config.json');
			readFile(configPath, 'utf8', (error, data) => {
				const config = error ? initialConfig : JSON.parse(data);
				const heroesPath = join(appPath, 'heroes.json');
				readFile(heroesPath, 'utf8', (error, data) => {
					const heroes = error ? [] : JSON.parse(data);
					const initialData = {
						config,
						heroes,
						tables,
					};
					FileActions.receiveInitialData(initialData);
				});
			});
		}
	});
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
		professionsVisibilityFilter: ProfessionStore.areAllVisible(),
		professionsFromExpansionsVisibility: false,
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
	};

	try {
		writeFileSync(path, JSON.stringify(data), { encoding: 'utf8' });
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
		writeFileSync(path, JSON.stringify(data), { encoding: 'utf8' });
	}
	catch (error) {
		alert('Fehler', `Beim Speichern der Helden ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
	}
}

export function saveHero(indexId: string) {
	const currentWindow = remote.getCurrentWindow();
	const data = HerolistStore.getForSave(indexId);
	remote.dialog.showSaveDialog(currentWindow, {
		title: 'Held als JSON speichern',
		filters: [
			{name: 'JSON', extensions: ['json']},
		],
		defaultPath: data.name
	}, filename => {
		if (filename) {
			writeFile(filename, JSON.stringify(data), error => {
				if (error) {
					alert('Fehler', `Beim Speichern der Datei ist ein Fehler aufgetreten. Informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
				}
				else {
					alert('Held gepeichert');
				}
			});
		}
	});
}

export function saveAll() {
	saveConfig();
	saveAllHeroes();
}

export function printToPDF() {
	const currentWindow = remote.getCurrentWindow();
	currentWindow.webContents.printToPDF({
		marginsType: 1,
		pageSize: 'A4',
		printBackground: true,
	}, (error, data) => {
		if (error) {
			alert('Fehler', `Bei der Generierung der PDF ist ein Fehler aufgetreten. Versuche es noch einmal. Falls es immer noch nicht gelingen sollte, informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
		}
		else {
			remote.dialog.showSaveDialog(currentWindow, {
				title: 'Heldendokument als PDF speichern',
				filters: [
					{name: 'PDF', extensions: ['pdf']},
				],
			}, filename => {
				if (filename) {
					writeFile(filename, data, error => {
						if (error) {
							alert('Fehler', `Beim Speichern der PDF ist ein Fehler aufgetreten. Überprüfe, ob, wenn du hiermit eine alte PDF überschreibst, du diese alte PDF nicht irgendwo geöffnet hast, denn solange sie geöffnet ist, kann sie nicht überschrieben werden! Falls es immer noch nicht gelingen sollte, informiere bitte die Entwickler! (Fehler: ${JSON.stringify(error)})`);
						}
						else {
							alert('PDF gespeichert');
						}
					});
				}
			});
		}
	});
}

export function importHero(path: string) {
	readFile(path, 'utf8', (error, data) => {
		if (error) {
			alert('Fehler', `Bei der Laden der Datei ist ein Fehler aufgetreten. (Fehler: ${JSON.stringify(error)})`);
		}
		else {
			FileActions.receiveImportedHero(JSON.parse(data));
		}
	});
}
