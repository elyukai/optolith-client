import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSectionAction, SetTabAction } from '../actions/LocationActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = SetSectionAction | SetTabAction | CreateHeroAction | LoadHeroAction | SetSelectionsAction;

export interface UILocationState {
	section: string;
	tab: string;
}

const initialState: UILocationState = {
	section: 'main',
	tab: 'herolist'
};

export function uilocation(state: UILocationState = initialState, action: Action): UILocationState {
	switch (action.type) {
		case ActionTypes.SET_TAB:
			return { ...state, tab: action.payload.tab };

		case ActionTypes.SET_SECTION:
			return updateSection(state, action.payload.section);

		case ActionTypes.CREATE_HERO:
			return updateSection(state, 'hero', 'rcp');

		case ActionTypes.LOAD_HERO:
			return updateSection(state, 'hero', 'profile');

		case ActionTypes.ASSIGN_RCP_OPTIONS:
			return { ...state, tab: 'attributes' };

		default:
			return state;
	}
}

function updateSection(state: UILocationState, section: string, tab?: string) {
	const { section: currentSection } = state;

	if (section !== currentSection) {
		const before = currentSection;

		if (tab) {
			return { section, tab };
		}

		switch (section) {
			case 'main':
				if (before === 'hero') {
					return { section, tab: 'herolist' };
				}
				if (before === 'group') {
					return { section, tab: 'grouplist' };
				}
				return state;
			case 'hero':
				return { section, tab: 'profile' };
			case 'group':
				return { section, tab: 'master' };
		}
	}

	return state;
}
