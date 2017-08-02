import { SelectCultureAction } from '../actions/CultureActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction } from '../actions/RaceActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = CreateHeroAction | LoadHeroAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction;

export interface RCPState {
	race?: string;
	culture?: string;
	profession?: string;
	professionVariant?: string;
}

export function rcp(state: RCPState = {}, action: Action): RCPState {
	switch (action.type) {
		case ActionTypes.LOAD_HERO: {
			const { c, p, pv, r } = action.payload.data;
			return {
				race: r,
				culture: c,
				profession: p,
				professionVariant: pv
			};
		}

		case ActionTypes.CREATE_HERO:
			return {};

		case ActionTypes.SELECT_RACE:
			return {
				race: action.payload.id
			};

		case ActionTypes.SELECT_CULTURE:
			return {
				race: state.race,
				culture: action.payload.id
			};

		case ActionTypes.SELECT_PROFESSION:
			return {
				race: state.race,
				culture: state.culture,
				profession: action.payload.id
			};

		case ActionTypes.SELECT_PROFESSION_VARIANT:
			return {
				race: state.race,
				culture: state.culture,
				profession: state.profession,
				professionVariant: action.payload.id
			};

		default:
			return state;
	}
}
