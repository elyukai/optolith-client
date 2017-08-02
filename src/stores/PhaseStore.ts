import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { EndHeroCreationAction } from '../actions/ProfileActions';
import * as ActionTypes from '../constants/ActionTypes';

import { Store } from './Store';

type Action = LoadHeroAction | CreateHeroAction | SetSelectionsAction | EndHeroCreationAction;

class PhaseStoreStatic extends Store {
	private phase = 1;
	readonly dispatchToken: string;

	get() {
		return this.phase;
	}

	private update(phase: number) {
		this.phase = phase;
	}
}

export const PhaseStore = new PhaseStoreStatic();
