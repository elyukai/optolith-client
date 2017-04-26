import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetHigherParadeValuesAction, SwitchAttributeValueLimitAction } from '../actions/RulesActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Rules } from '../types/data.d';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | LoadHeroAction | CreateHeroAction | SetHigherParadeValuesAction | SwitchAttributeValueLimitAction;

class RulesStoreStatic extends Store {
	private rules: Rules;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
				case ActionTypes.CREATE_HERO:
					this.rules = {
						higherParadeValues: 0,
						attributeValueLimit: false,
					};
					break;

				case ActionTypes.LOAD_HERO:
					this.rules = {
						...this.rules,
						...action.payload.data.rules,
					};
					break;

				case ActionTypes.SET_HIGHER_PARADE_VALUES:
					this.rules.higherParadeValues = action.payload.value;
					break;

				case ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT:
					this.rules.attributeValueLimit = !this.rules.attributeValueLimit;
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return this.rules;
	}

	getAttributeValueLimit() {
		return this.rules.attributeValueLimit;
	}
}

export const RulesStore = new RulesStoreStatic();
