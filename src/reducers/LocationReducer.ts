import { LoginAction, LogoutAction } from '../actions/AuthActions';
import { ShowSectionAction, ShowTabAction } from '../actions/TabActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = LoginAction | LogoutAction | ShowSectionAction | ShowTabAction;

export interface LocationState {
	readonly loggedIn: boolean;
	readonly section: 'main' | 'hero' | 'group';
	readonly tab: string;
}

const initialState = <LocationState>{
	loggedIn: true,
	section: 'main',
	tab: 'herolist'
};

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.LOGIN:
			return { ...state, loggedIn: true, tab: 'herolist' }

		case ActionTypes.LOGOUT:
			return { ...state, loggedIn: false, tab: 'home' }

		case ActionTypes.SHOW_TAB:
			return { ...state, tab: action.payload.tab }

		case ActionTypes.SHOW_SECTION: {
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
