import { RECEIVE_DATA_TABLES, RECEIVE_HERO_DATA, SELECT_CULTURE, SELECT_PROFESSION, SELECT_PROFESSION_VARIANT, SELECT_RACE } from '../constants/ActionTypes';
import { PROFESSION_VARIANTS } from '../constants/Categories';
import { SelectCultureAction } from '../actions/CultureActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { RawProfessionVariant, ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { fixIDs } from '../utils/DataUtils';
import dice from '../utils/dice';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | SelectRaceAction;

export interface ProfessionVariant {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly category: PROFESSION_VARIANTS;
}

export interface ProfessionVariantState {
	readonly byId: {
		[id: string]: ProfessionVariant;
	};
	readonly allIds: string[];
	readonly currentId: string | null;
}

const initialState = <ProfessionVariantState>{
	byId: {},
	allIds: [],
	currentId: null
};

function init({ id, name, subname, ap, pre_req, req, sel, sa, combattech, talents }: RawProfessionVariant): ProfessionVariant {
	return {
		id,
		name,
		ap,
		category: PROFESSION_VARIANTS,

		reqs_p: pre_req,
		reqs: req,
		sel,

		specialabilities: fixIDs<number | boolean>(sa, 'SA'),
		combattechniques: fixIDs<number>(combattech, 'CT'),
		talents: fixIDs<number>(talents, 'TAL')
	}
}

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case RECEIVE_DATA_TABLES: {
			const byId: { [id: string]: ProfessionVariant } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.professionVariants) {
				byId[id] = init(action.payload.data.professionVariants[id]);
				allIds.push(id);
			}
			return { ...state, byId, allIds };
		}

		case RECEIVE_HERO_DATA:
			return { ...state, currentId: action.payload.data.pv };

		case SELECT_RACE:
		case SELECT_CULTURE:
		case SELECT_PROFESSION:
			return { ...state, currentId: null };

		case SELECT_PROFESSION_VARIANT:
			return { ...state, currentId: action.payload.id };

		default:
			return state;
	}
}
