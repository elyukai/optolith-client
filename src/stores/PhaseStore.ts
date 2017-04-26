import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { EndHeroCreationAction } from '../actions/ProfileActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Store } from './Store';

type Action = LoadHeroAction | CreateHeroAction | SetSelectionsAction | EndHeroCreationAction;

class PhaseStoreStatic extends Store {
	private phase = 1;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.LOAD_HERO:
					this.update(action.payload.data.phase);
					break;

				case ActionTypes.CREATE_HERO:
					this.update(1);
					break;

				case ActionTypes.ASSIGN_RCP_OPTIONS:
					this.update(2);
					break;

				case ActionTypes.END_HERO_CREATION:
					this.update(3);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get() {
		return this.phase;
	}

	private update(phase: number) {
		this.phase = phase;
	}
}

export const PhaseStore = new PhaseStoreStatic();
