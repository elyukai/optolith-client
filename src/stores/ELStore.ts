import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ExperienceLevel, ToListById } from '../types/data.d';
import { RawExperienceLevel, RawExperienceLevelLocale } from '../types/rawdata.d';
import { initExperienceLevel } from '../utils/InitUtils';
import { LocaleStore } from './LocaleStore';
import { Store } from './Store';

type Action = CreateHeroAction | LoadHeroAction | ReceiveInitialDataAction;

class ELStoreStatic extends Store {
	private byId: ToListById<ExperienceLevel> = {};
	private allIds: string[];
	private start = 'EL_0';
	readonly dispatchToken: string;

	get(id: string) {
		return this.byId[id];
	}

	getAll() {
		return this.byId;
	}

	getStartID() {
		return this.start;
	}

	getStart() {
		return this.get(this.getStartID());
	}

	private init(el: ToListById<RawExperienceLevel>, locale: ToListById<RawExperienceLevelLocale>) {
		this.allIds = Object.keys(el);
		this.allIds.forEach(e => {
			const result = initExperienceLevel(el[e], locale);
			if (result) {
				this.byId[e] = result;
			}
		});
	}

	private update(el: string) {
		this.start = el;
	}
}

export const ELStore = new ELStoreStatic();
