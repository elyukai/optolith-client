import { ReceiveLoginAction, ReceiveLogoutAction } from '../actions/AuthActions';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSectionAction, SetTabAction } from '../actions/LocationActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { ReceiveHeroDataAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveLoginAction | ReceiveLogoutAction | SetSectionAction | SetTabAction | CreateHeroAction | ReceiveHeroDataAction | SetSelectionsAction;

export interface LocationState {
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
							tab = loggedIn ? 'herolist' : 'home';
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

		case ActionTypes.CREATE_HERO:
			return { ...state, section: 'hero' as 'hero', tab: 'rcp' };

		case ActionTypes.RECEIVE_HERO_DATA:
			return { ...state, section: 'hero' as 'hero', tab: 'profile' };

		case ActionTypes.ASSIGN_RCP_OPTIONS:
			return { ...state, tab: 'attributes' };

		default:
			return state;
	}
}
