import { SelectCultureAction } from '../actions/CultureActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction } from '../actions/RaceActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

import { ProfessionVariantInstance } from '../types/data.d';
import { validate } from '../utils/RequirementUtils';
import { APStore } from './APStore';
import { ELStore } from './ELStore';
import { get, getAllByCategory } from './ListStore';
import { Store } from './Store';

type Action = LoadHeroAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction;

class ProfessionVariantStoreStatic extends Store {
	private readonly category = Categories.PROFESSION_VARIANTS;
	readonly dispatchToken: string;
	private currentId?: string;

	getAll() {
		return getAllByCategory(this.category) as ProfessionVariantInstance[];
	}

	getAllValid(variants: string[]) {
		const allEntries = getAllByCategory(this.category) as ProfessionVariantInstance[];
		return allEntries.filter(e => {
			if (variants.includes(e.id)) {
				const { dependencies, requires } = e;
				const validRequires = validate(dependencies, e.id) && !requires.some(d => {
					if (typeof d.id === 'string') {
						const entry = get(d.id);
						if (typeof entry !== 'undefined' && entry.category === Categories.ATTRIBUTES && entry.value > ELStore.getStart().maxAttributeValue) {
							return true;
						}
						return false;
					}
					return false;
				});
				return validRequires;
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
		const entry = get(id);
		return typeof entry !== 'undefined' ? entry.name : undefined;
	}

	private updateCurrentID(id?: string) {
		this.currentId = id;
	}
}

export const ProfessionVariantStore = new ProfessionVariantStoreStatic();
