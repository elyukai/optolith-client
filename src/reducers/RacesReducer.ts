import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { SelectRaceAction } from '../actions/RaceActions';
import { FetchDataTablesAction, FetchCharacterDataAction } from '../actions/ServerActions';
import { fixIDs } from '../utils/DataUtils';
import dice from '../utils/dice';

type Action = FetchDataTablesAction | FetchCharacterDataAction | SelectRaceAction;

export interface Race {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly lp: number;
	readonly spi: number;
	readonly tou: number;
	readonly mov: number;
	readonly attr: (string | number)[][];
	readonly attr_sel: [number, string[]];
	readonly typ_cultures: string[];
	readonly auto_adv: (string | number)[][];
	readonly imp_adv: (string | number)[][];
	readonly imp_dadv: (string | number)[][];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly haircolors: number[];
	readonly eyecolors: number[];
	readonly size: (number | number[])[];
	readonly weight: (number | number[])[];
	readonly category: string;
}

export interface RawRace {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly le: number;
	readonly sk: number;
	readonly zk: number;
	readonly gs: number;
	readonly attr: number[][];
	readonly attr_sel: [number, number[]];
	readonly typ_cultures: string[];
	readonly auto_adv: string[][];
	readonly imp_adv: (string | number)[][];
	readonly imp_dadv: (string | number)[][];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly hair: number[];
	readonly eyes: number[];
	readonly size: (number | number[])[];
	readonly weight: (number | number[])[];
}

export const haircolors = [ 'blauschwarz', 'blond', 'braun', 'dunkelblond', 'dunkelbraun', 'goldblond', 'grau', 'hellblond', 'hellbraun', 'kupferrot', 'mittelblond', 'mittelbraun', 'rot', 'rotblond', 'schneeweiß', 'schwarz', 'silbern', 'weißblond', 'dunkelgrau', 'hellgrau', 'salzweiß', 'silberweiß', 'feuerrot' ];

export const eyecolors = [ 'amethystviolett', 'bernsteinfarben', 'blau', 'braun', 'dunkelbraun', 'dunkelviolett', 'eisgrau', 'goldgesprenkelt', 'grau', 'graublau', 'grün', 'hellbraun', 'rubinrot', 'saphirblau', 'schwarz', 'schwarzbraun', 'silbergrau', 'smaragdgrün' ];

export const rerollHaircolor = (current: Race) => {
	const result = dice(20);
	return current.haircolors[result - 1];
}

export const rerollEyecolor = (current: Race) => {
	const result = dice(20);
	return current.eyecolors[result - 1];
}

export const rerollSize = (current: Race) => {
	const [ base, ...dices ] = current.size;
	let arr: number[] = [];
	dices.forEach((e: number[]) => {
		let elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	return (base as number) + arr.map(e => dice(e)).reduce((a,b) => a + b, 0);
}

export const rerollWeight = (current: Race, size: number) => {
	const { id, weight } = current;
	const [ base, ...dices ] = weight;
	let arr: number[] = [];
	dices.forEach((e: number[]) => {
		let elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	size = size || this.rerollSize(current);
	let add = ['R_1','R_2','R_3','R_4','R_5','R_6','R_7'].includes(id) ?
		arr.map(e => {
			let result = dice(Math.abs(e));
			return result % 2 > 0 ? -result : result;
		}) :
		arr.map(e => {
			let result = dice(Math.abs(e));
			return e < 0 ? -result : result;
		});
	return size + (base as number) + add.reduce((a,b) => a + b, 0);
}

export interface RaceState {
	readonly byId: {
		[id: string]: Race;
	};
	readonly allIds: string[];
	readonly current: string | null;
}

const initialState = <RaceState>{
	byId: {},
	allIds: [],
	current: null
};

function init({ id, name, ap, le, sk, zk, gs, attr, attr_sel, typ_cultures, auto_adv, imp_adv, imp_dadv, typ_adv, typ_dadv, untyp_adv, untyp_dadv, hair, eyes, size, weight }: RawRace): Race {
	return {
		id,
		name,
		ap,
		category: Categories.RACES,

		lp: le,
		spi: sk,
		tou: zk,
		mov: gs,

		attr: fixIDs<number>(attr, 'ATTR', 1),
		attr_sel: [attr_sel[0], attr_sel[1].map(k => `ATTR_${k}`)],

		typ_cultures: typ_cultures.map(e => `C_${e}`),

		auto_adv: fixIDs<number>(auto_adv, 'ADV'),
		imp_adv: fixIDs<number>(imp_adv, 'ADV'),
		imp_dadv: fixIDs<number>(imp_dadv, 'DISADV'),

		typ_adv: typ_adv.map(e => `ADV_${e}`),
		typ_dadv: typ_dadv.map(e => `DISADV_${e}`),
		untyp_adv: untyp_adv.map(e => `ADV_${e}`),
		untyp_dadv: untyp_dadv.map(e => `DISADV_${e}`),

		haircolors: hair,
		eyecolors: eyes,
		size,
		weight
	}
}

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_DATA_TABLES: {
			const byId: { [id: string]: Race } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.races) {
				byId[id] = init(action.payload.data.races[id]);
				allIds.push(id);
			}
			return { ...state, byId, allIds };
		}

		case ActionTypes.FETCH_CHARACTER_DATA:
			return { ...state, current: action.payload.data.r };

		case ActionTypes.SELECT_RACE:
			return { ...state, current: action.payload.id};

		default:
			return state;
	}
}
