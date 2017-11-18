import { SelectCultureAction } from '../actions/CultureActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction, SetRaceVariantAction } from '../actions/RaceActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = CreateHeroAction | LoadHeroAction | SelectRaceAction | SetRaceVariantAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction;

export interface RCPState {
	race?: string;
	raceVariant?: string;
	culture?: string;
	profession?: string;
	professionVariant?: string;
}

export function rcp(state: RCPState = {}, action: Action): RCPState {
	switch (action.type) {
		case ActionTypes.LOAD_HERO: {
			const { c, p, pv, r, rv } = action.payload.data;
			return {
				race: r,
				raceVariant: rv,
				culture: c,
				profession: p,
				professionVariant: pv
			};
		}

		case ActionTypes.CREATE_HERO:
			return {};

		case ActionTypes.SELECT_RACE: {
			const { id, variantId } = action.payload;
			return {
				race: id,
				raceVariant: variantId
			};
		}

		case ActionTypes.SET_RACE_VARIANT: {
			const { race } = state;
			return {
				race,
				raceVariant: action.payload.id
			};
		}

		case ActionTypes.SELECT_CULTURE: {
			const { race, raceVariant } = state;
			return {
				race,
				raceVariant,
				culture: action.payload.id
			};
		}

		case ActionTypes.SELECT_PROFESSION: {
			const { race, raceVariant, culture } = state;
			return {
				race,
				raceVariant,
				culture,
				profession: action.payload.id
			};
		}

		case ActionTypes.SELECT_PROFESSION_VARIANT: {
			const { race, raceVariant, culture, profession } = state;
			return {
				race,
				raceVariant,
				culture,
				profession,
				professionVariant: action.payload.id
			};
		}

		default:
			return state;
	}
}
