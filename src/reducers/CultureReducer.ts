/// <reference path="../raw.d.ts" />

import { CULTURES } from '../constants/Categories';
import { fixIDs } from '../utils/DataUtils';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { RECEIVE_DATA_TABLES, RECEIVE_HERO_DATA, SELECT_CULTURE, SELECT_RACE } from '../constants/ActionTypes';
import { SelectCultureAction } from '../actions/CultureActions';
import { SelectRaceAction } from '../actions/RaceActions';
import dice from '../utils/dice';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | SelectCultureAction | SelectRaceAction;

export interface Culture {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly social: number[];
	readonly typ_prof: string[];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly typ_talents: string[];
	readonly untyp_talents: string[];
	readonly talents: (string | number)[][];
	readonly category: CULTURES;
}

export interface CultureState {
	readonly byId: {
		[id: string]: Culture;
	};
	readonly allIds: string[];
	readonly currentId: string | null;
}

const initialState = <CultureState>{
	byId: {},
	allIds: [],
	currentId: null
};

function init({ id, name, ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents }: RawCulture): Culture {
	return {
		id,
		name,
		ap,
		category: CULTURES,

		languages: lang,
		scripts: literacy,
		social: social,

		typ_prof: typ_prof.map(e => `P_${e}`),

		typ_adv: typ_adv.map(e => `ADV_${e}`),
		typ_dadv: typ_dadv.map(e => `DISADV_${e}`),
		untyp_adv: untyp_adv.map(e => `ADV_${e}`),
		untyp_dadv: untyp_dadv.map(e => `DISADV_${e}`),

		typ_talents: typ_talents.map(e => `TAL_${e}`),
		untyp_talents: untyp_talents.map(e => `TAL_${e}`),
		talents: fixIDs<number>(talents, 'TAL'),
	}
}

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case RECEIVE_DATA_TABLES: {
			const byId: { [id: string]: Culture } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.cultures) {
				byId[id] = init(action.payload.data.cultures[id]);
				allIds.push(id);
			}
			return { ...state, byId, allIds };
		}

		case RECEIVE_HERO_DATA:
			return { ...state, currentId: action.payload.data.r };

		case SELECT_RACE:
			return { ...state, currentId: null };

		case SELECT_CULTURE:
			return { ...state, currentId: action.payload.id };

		default:
			return state;
	}
}
