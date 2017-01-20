import { SetHeroAvatarAction } from '../actions/ProfileActions';
import { AddArcaneEnergyPointAction, AddKarmaPointAction, AddLifePointAction } from '../actions/AttributesActions';
import { ADD_ARCANE_ENERGY_POINT, ADD_KARMA_POINT, ADD_LIFE_POINT } from '../constants/ActionTypes';

type Action = AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction;

export interface AddEnergiesState {
	lp: number;
	ae: number;
	kp: number;
}

const initialState: AddEnergiesState = {
	lp: 0,
	ae: 0,
	kp: 0
}

export default (state: AddEnergiesState = initialState, action: Action): AddEnergiesState => {
	switch (action.type) {
		case ADD_ARCANE_ENERGY_POINT:
			return { ...state, ae: state.ae + 1 };

		case ADD_KARMA_POINT:
			return { ...state, kp: state.kp + 1 };

		case ADD_LIFE_POINT:
			return { ...state, lp: state.lp + 1 };

		default:
			return state;
	}
};
