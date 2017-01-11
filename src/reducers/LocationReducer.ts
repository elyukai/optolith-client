import { LoginAction, LogoutAction } from '../actions/AuthActions';
import { SetSectionAction, SetTabAction } from '../actions/LocationActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = LoginAction | LogoutAction | SetSectionAction | SetTabAction;

export interface LocationState {
	readonly loggedIn: boolean;
	readonly section: 'main' | 'hero' | 'group';
	readonly tab: string;
}

const initialState = <LocationState>{
	section: 'main',
	tab: 'herolist'
};

export default (state = initialState, action: Action, loggedIn: boolean) => {
	switch (action.type) {
		case ActionTypes.SET_TAB:
			return { ...state, tab: action.payload.tab }

		case ActionTypes.SET_SECTION: {
			const section = action.payload.section;
			let tab = action.payload.tab;
			if (!tab) {
				switch (section) {
					case 'main':
						if (state.section === 'hero') {
							tab = state.loggedIn ? 'herolist' : 'home';
						} else if (state.section === 'group') {
							tab = 'grouplist';
						}
						break;
					case 'hero':
						tab = 'profile';
						break;

					case 'group':
						tab = 'master';
						break;
				}
			}
			return { ...state, section, tab };
		}

		// case ActionTypes.CREATE_NEW_HERO:
		// 	return state.set('section', 'hero').set('tab', 'rcp');

		// case ActionTypes.RECEIVE_HERO:
		// 	return state.set('section', 'hero').set('tab', 'profile');

		// case ActionTypes.ASSIGN_RCP_ENTRIES:
		// 	return state.set('tab', 'attributes');

		default:
			return state;
	}
}
