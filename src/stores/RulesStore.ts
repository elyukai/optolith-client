import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | CreateHeroAction | SetHigherParadeValuesAction;

let rules: Rules;

class RulesStoreStatic extends Store {
	getAll() {
		return rules;
	}
}

const RulesStore = new RulesStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_DATA_TABLES:
		case ActionTypes.CREATE_HERO:
			rules = {
				higherParadeValues: 0,
			};
			break;

		case ActionTypes.RECEIVE_HERO_DATA:
			rules = action.payload.data.rules;
			break;

		case ActionTypes.SET_HIGHER_PARADE_VALUES:
			rules.higherParadeValues = action.payload.value;
			break;

		default:
			return true;
	}

	RulesStore.emitChange();
	return true;
});

export default RulesStore;
