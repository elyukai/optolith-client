/// <reference path="../raw.d.ts" />

import { RECEIVE_DATA_TABLES, RECEIVE_HERO_DATA, SELECT_CULTURE, SELECT_PROFESSION, SELECT_RACE } from '../constants/ActionTypes';
import { PROFESSIONS } from '../constants/Categories';
import { SelectCultureAction } from '../actions/CultureActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { fixIDs } from '../utils/DataUtils';
import dice from '../utils/dice';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction;

export interface Profession {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly subname: string | { m: string, f: string };
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly spells: (string | number)[][];
	readonly liturgies: (string | number)[][];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly variants: string[];
	readonly category: PROFESSIONS;
}

export interface ProfessionState {
	readonly byId: {
		[id: string]: Profession;
	};
	readonly allIds: string[];
	readonly currentId: string | null;
}

const initialState = <ProfessionState>{
	byId: {},
	allIds: [],
	currentId: null
};

function init({ id, name, subname, ap, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars }: RawProfession): Profession {
	return {
		id,
		name,
		subname,
		ap,
		category: PROFESSIONS,

		reqs_p: pre_req,
		reqs: req,
		sel,

		specialabilities: fixIDs<number | boolean>(sa, 'SA'),
		combattechniques: fixIDs<number>(combattech, 'CT'),
		talents: fixIDs<number>(talents, 'TAL'),
		spells: fixIDs<number>(spells, 'SPELL'),
		liturgies: fixIDs<number>(chants, 'LITURGY'),

		typ_adv: typ_adv.map(e => `ADV_${e}`),
		typ_dadv: typ_dadv.map(e => `DISADV_${e}`),
		untyp_adv: untyp_adv.map(e => `ADV_${e}`),
		untyp_dadv: untyp_dadv.map(e => `DISADV_${e}`),

		variants: vars.map(e => `PV_${e}`)
	}
}

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case RECEIVE_DATA_TABLES: {
			const byId: { [id: string]: Profession } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.professions) {
				byId[id] = init(action.payload.data.professions[id]);
				allIds.push(id);
			}
			byId['P_0'] = init({
				id: 'P_0',
				name: 'Eigene Profession',
				subname: '',
				ap: 0,
				pre_req: [],
				req: [],
				sel: [],
				sa: [],
				combattech: [],
				talents: [],
				spells: [],
				chants: [],
				typ_adv: [],
				typ_dadv: [],
				untyp_adv: [],
				untyp_dadv: [],
				vars: []
			});
			allIds.push('P_0');
			return { ...state, byId, allIds };
		}

		case RECEIVE_HERO_DATA:
			return { ...state, currentId: action.payload.data.p };

		case SELECT_RACE:
		case SELECT_CULTURE:
			return { ...state, currentId: null };

		case SELECT_PROFESSION:
			return { ...state, currentId: action.payload.id };

		default:
			return state;
	}
}
