import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | CreateHeroAction | SetHigherParadeValuesAction;

class RulesStoreStatic extends Store {
	private rules: Rules;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_DATA_TABLES:
				case ActionTypes.CREATE_HERO:
					this.rules = {
						higherParadeValues: 0,
					};
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.rules = action.payload.data.rules;
					break;

				case ActionTypes.SET_HIGHER_PARADE_VALUES:
					this.rules.higherParadeValues = action.payload.value;
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
}

const RulesStore = new RulesStoreStatic();

export default RulesStore;
