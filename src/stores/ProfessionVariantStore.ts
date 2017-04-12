import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from './APStore';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import { get, getAllByCategory } from './ListStore';
import ProfileStore from './ProfileStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction;

class ProfessionVariantStoreStatic extends Store {
	private readonly category: PROFESSION_VARIANTS = Categories.PROFESSION_VARIANTS;
	readonly dispatchToken: string;
	private currentId: string | null = null;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateCurrentID(action.payload.data.pv);
					break;

				case ActionTypes.CREATE_HERO:
				case ActionTypes.SELECT_RACE:
				case ActionTypes.SELECT_CULTURE:
				case ActionTypes.SELECT_PROFESSION:
					this.updateCurrentID(null);
					break;

				case ActionTypes.SELECT_PROFESSION_VARIANT:
					AppDispatcher.waitFor([APStore.dispatchToken]);
					this.updateCurrentID(action.payload.id);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as ProfessionVariantInstance[];
	}

	getAllValid(variants: string[]) {
		const allEntries = getAllByCategory(this.category) as ProfessionVariantInstance[];
		return allEntries.filter(e => {
			if (variants.includes(e.id)) {
				const { dependencies, requires } = e;
				const validDependencies = dependencies.every(req => {
					if (req.id === 'CULTURE') {
						const cultureID = CultureStore.getCurrentID() as string;
						return (req.value as string[]).includes(cultureID);
					} else if (req.id === 'SEX') {
						const sex = ProfileStore.getSex();
						return sex === req.value;
					}
					return false;
				});
				const validRequires = !requires.some(d => {
					if (typeof d.id === 'string') {
						const entry = get(d.id);
						if (entry.category === Categories.ATTRIBUTES && entry.value > ELStore.getStart().maxAttributeValue) {
							return true;
						}
						return false;
					}
					return false;
				});
				return validDependencies && validRequires;
			}
			return false;
		});
	}

	getCurrentID() {
		return this.currentId;
	}

	getCurrent() {
		return this.currentId ? get(this.currentId) as ProfessionVariantInstance : undefined;
	}

	getCurrentName() {
		const current = this.getCurrent();
		return current ? current.name : undefined;
	}

	getNameByID(id: string) {
		return get(id) !== undefined ? get(id).name : undefined;
	}

	private updateCurrentID(id: string | null) {
		this.currentId = id;
	}
}

const ProfessionVariantStore = new ProfessionVariantStoreStatic();

export default ProfessionVariantStore;
