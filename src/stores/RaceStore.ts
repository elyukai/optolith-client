import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import dice from '../utils/dice';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = SelectRaceAction | ReceiveHeroDataAction | SetRacesSortOrderAction | SwitchRaceValueVisibilityAction;

class RaceStoreStatic extends Store {
	private readonly category: RACES = Categories.RACES;
	private currentId: string | null = null;
	private sortOrder = 'name';
	private showDetails = true;
	readonly dispatchToken: string;
	readonly hairColors = ['blauschwarz', 'blond', 'braun', 'dunkelblond', 'dunkelbraun', 'goldblond', 'grau', 'hellblond', 'hellbraun', 'kupferrot', 'mittelblond', 'mittelbraun', 'rot', 'rotblond', 'schneeweiß', 'schwarz', 'silbern', 'weißblond', 'dunkelgrau', 'hellgrau', 'salzweiß', 'silberweiß', 'feuerrot'];
	readonly eyeColors = ['amethystviolett', 'bernsteinfarben', 'blau', 'braun', 'dunkelbraun', 'dunkelviolett', 'eisgrau', 'goldgesprenkelt', 'grau', 'graublau', 'grün', 'hellbraun', 'rubinrot', 'saphirblau', 'schwarz', 'schwarzbraun', 'silbergrau', 'smaragdgrün'];

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateCurrentID(action.payload.data.r);
					break;

				case ActionTypes.SELECT_RACE:
					AppDispatcher.waitFor([APStore.dispatchToken]);
					this.updateCurrentID(action.payload.id);
					break;

				case ActionTypes.SET_RACES_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
					this.updateDetails();
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as RaceInstance[];
	}

	getCurrentID() {
		return this.currentId;
	}

	getCurrent() {
		return this.currentId !== null ? get(this.currentId) as RaceInstance : undefined;
	}

	getCurrentName() {
		const current = this.getCurrent();
		return current ? current.name : undefined;
	}

	getNameByID(id: string) {
		return get(id) ? get(id).name : null;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	areValuesVisible() {
		return this.showDetails;
	}

	rerollHairColor(current: RaceInstance) {
		const result = dice(20);
		return current.hairColors[result - 1];
	}

	rerollEyeColor(current: RaceInstance) {
		const result = dice(20);
		return current.eyeColors[result - 1];
	}

	rerollSize(race: RaceInstance) {
		const [ base, ...dices ] = race.size;
		const arr: number[] = [];
		dices.forEach((e: [number, number]) => {
			const elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		const result = (base as number) + arr.map(e => dice(e)).reduce((a, b) => a + b, 0);
		return result.toString();
	}

	rerollWeight(race: RaceInstance, size: string = this.rerollSize(race)) {
		const { id, weight } = race;
		const [ base, ...dices ] = weight;
		const arr: number[] = [];
		dices.forEach((e: [number, number]) => {
			const elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		const add = ['R_1', 'R_2', 'R_3', 'R_4', 'R_5', 'R_6', 'R_7'].includes(id) ?
			arr.map(e => {
				const result = dice(Math.abs(e));
				return result % 2 > 0 ? -result : result;
			}) :
			arr.map(e => {
				const result = dice(Math.abs(e));
				return e < 0 ? -result : result;
			});
		const result = Number.parseInt(size) + (base as number) + add.reduce((a, b) => a + b, 0);
		return [result.toString(), size] as [string, string];
	}

	private updateCurrentID(id: string | null) {
		this.currentId = id;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateDetails() {
		this.showDetails = !this.showDetails;
	}
}

const RaceStore = new RaceStoreStatic();

export default RaceStore;
