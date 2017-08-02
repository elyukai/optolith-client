import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../stores/ListStore';
import { ActivatableInstance, HistoryObject, HistoryPayload, HistoryPrevState, IncreasableInstance, Selections } from '../types/data.d';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import { APStore } from './APStore';
import { AttributeStore } from './AttributeStore';
import { CultureStore } from './CultureStore';
import { ELStore } from './ELStore';
import { ListStore } from './ListStore';
import { ProfessionStore } from './ProfessionStore';
import { ProfessionVariantStore } from './ProfessionVariantStore';
import { RaceStore } from './RaceStore';
import { RequirementsStore } from './RequirementsStore';
import { Store } from './Store';

class HistoryStoreStatic extends Store {
	readonly dispatchToken: string;
	private history: HistoryObject[] = [];
	private lastSaveIndex = -1;

	get(index: number) {
		return this.history[index];
	}

	getAll() {
		return this.history;
	}

	isUndoAvailable() {
		return this.lastSaveIndex < this.history.length - 1;
	}

	getUndo(): Action | undefined {
		const lastIndex = this.history.length - 1;
		if (this.lastSaveIndex < lastIndex) {
			return this.history[this.history.length - 1];
		}
		return undefined;
	}

	private add(type: string, cost = 0, payload: HistoryPayload = {}, prevState: HistoryPrevState = {}) {
		this.history.push({
			type,
			cost,
			payload,
			prevState,
		});
	}

	private clear() {
		this.history = [];
	}

	private resetSaveIndex() {
		this.lastSaveIndex = this.history.length - 1;
	}

	private updateAll(array: HistoryObject[]) {
		this.history = array;
		this.lastSaveIndex = this.history.length - 1;
	}

	private assignRCP(selections: Selections) {
		const el = ELStore.getStart();
		this.add('SELECT_EXPERIENCE_LEVEL', -el.ap, { id: el.id });
		const race = RaceStore.getCurrent();
		this.add(ActionTypes.SELECT_RACE, race!.ap, { id: race!.id });
		const culture = CultureStore.getCurrent();
		this.add(ActionTypes.SELECT_CULTURE, culture!.ap, { id: culture!.id });
		const profession = ProfessionStore.getCurrent();
		this.add(ActionTypes.SELECT_PROFESSION, profession!.ap, { id: profession!.id });
		const professionVariant = ProfessionVariantStore.getCurrent();
		if (professionVariant) {
			this.add(ActionTypes.SELECT_PROFESSION_VARIANT, professionVariant.ap, { id: professionVariant.id });
		}

		const { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = selections;

		this.add('SELECT_ATTRIBUTE_MOD', 0, { id: attrSel });
		this.add('PURCHASE_CULTURE_PACKAGE', 0, { buy: useCulturePackage });
		if (lang !== 0) {
			this.add('SELECT_MOTHER_TONGUE', 0, { id: lang });
		}
		this.add('PURCHASE_MAIN_SCRIPT', 0, { buy: buyLiteracy });
		if (spec) {
			this.add('SELECT_SKILL_SPECIALISATION', 0, { id: spec });
		}
		if (litc !== 0) {
			this.add('SELECT_MAIN_LITERACY', 0, { id: litc });
		}
		if (cantrips.size > 0) {
			this.add('SELECT_CANTRIPS', 0, { list: Array.from(cantrips) });
		}
		if (combattech.size > 0) {
			this.add('SELECT_COMBAT_TECHNIQUES', 0, { list: Array.from(combattech) });
		}
		if (curses.size > 0) {
			this.add('SELECT_CURSES', 0, { list: Array.from(curses) });
		}
		if (langLitc.size > 0) {
			this.add('SELECT_LANGUAGES_AND_LITERACIES', 0, { list: Array.from(langLitc) });
		}
	}
}

export const HistoryStore = new HistoryStoreStatic();
