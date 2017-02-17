import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = ReceiveHeroDataAction | CreateHeroAction | SetSelectionsAction | EndHeroCreationAction;

let _phase = 1;

function _update(phase: number) {
	_phase = phase;
}

class PhaseStoreStatic extends Store {

	get() {
		return _phase;
	}

}

const PhaseStore = new PhaseStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_update(action.payload.data.phase);
			break;

		case ActionTypes.CREATE_HERO:
			_update(1);
			break;

		case ActionTypes.ASSIGN_RCP_OPTIONS:
			_update(2);
			break;

		case ActionTypes.END_HERO_CREATION:
			_update(3);
			break;

		default:
			return true;
	}

	PhaseStore.emitChange();
	return true;
});

export default PhaseStore;
