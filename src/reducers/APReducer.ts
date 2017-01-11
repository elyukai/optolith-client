import * as ActionTypes from '../constants/ActionTypes';
import { HeroState } from './HeroReducer';
import { ReceiveHeroDataAction } from '../actions/ServerActions';
import { SelectCultureAction } from '../actions/CultureActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { ValidationResult } from './RequirementsReducer';

type Action = ReceiveHeroDataAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | SelectRaceAction;

export type APState = {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
};

const initialState: APState = {
	total: 0,
	spent: 0,
	adv: [0, 0, 0],
	disadv: [0, 0, 0]
};

export default (state: APState = initialState, action: Action, hero: HeroState, validResult: ValidationResult, reqPurchaseCost: number): APState => {
	const valid: boolean = validResult[0] as boolean;
	const cost: number = validResult[1] as number;
	const disadv: [boolean, 0 | 1 | 2] = validResult[2] as [boolean, 0 | 1 | 2];
	switch (action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			return action.payload.data.ap;

		case ActionTypes.CREATE_HERO:
			return {
				...initialState,
				total: hero.experienceLevelsById[hero.startExperienceLevel].ap
			};

		case ActionTypes.SELECT_RACE: {
			const raceAp = calcR(action.payload.id, hero);
			const cultureAp = calcC(null, hero);
			const professionAp = calcP(null, hero);
			const professionVariantAp = calcPV(null, hero);
			return { ...state, spent: state.spent + raceAp + cultureAp + professionAp + professionVariantAp };
		}

		case ActionTypes.SELECT_CULTURE: {
			const cultureAp = calcC(action.payload.id, hero);
			const professionAp = calcP(null, hero);
			const professionVariantAp = calcPV(null, hero);
			return { ...state, spent: state.spent + cultureAp + professionAp + professionVariantAp };
		}

		case ActionTypes.SELECT_PROFESSION: {
			const professionAp = calcP(action.payload.id, hero);
			const professionVariantAp = calcPV(null, hero);
			return { ...state, spent: state.spent + professionAp + professionVariantAp };
		}

		case ActionTypes.SELECT_PROFESSION_VARIANT: {
			const professionVariantAp = calcPV(action.payload.id, hero);
			return { ...state, spent: state.spent + professionVariantAp };
		}

		case ActionTypes.ASSIGN_RCP_OPTIONS: {
			let spent = state.spent;
			const culture = hero.cultures.byId[hero.cultures.currentId as string];
			if (!action.payload.selections.useCulturePackage) {
				spent -= culture.ap;
			}

			if (action.payload.selections.buyLiteracy) {
				let id = culture.scripts.length > 1 ? action.payload.selections.litc : culture.scripts[0];
				spent += hero.abilities.byId['SA_28'].sel[id - 1][2];
			}

			if (hero.professions.currentId !== null && hero.professions.currentId !== 'P_0') {
				spent += reqPurchaseCost;
			}

			return { ...state, spent };
		}

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
		case ActionTypes.ADD_LIFE_POINT:
		case ActionTypes.ADD_ARCANE_ENERGY_POINT:
		case ActionTypes.ADD_KARMA_POINT:
		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			if (valid) {
				return { ...state, spent: state.spent + cost };
			}
			return state;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.DEACTIVATE_DISADV:
			if (valid) {
				const propName = disadv[0] ? 'adv' : 'disadv';
				const prop = [ ...state[propName] ];
				const absCost = disadv[0] ? cost : -cost;
				prop[0] += absCost;
				if (disadv[1] > 0) {
					prop[disadv[1]] += absCost;
				}
				return {
					...state,
					spent: state.spent + cost,
					[propName]: prop
				};
			}
			return state;

		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.SET_SPECIALABILITY_TIER:
			if (valid) {
				return { ...state, spent: state.spent + cost };
			}
			return state;

		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			if (valid) {
				return { ...state, spent: state.spent - cost };
			}
			return state;

		case ActionTypes.ADD_ADVENTURE_POINTS:
			return { ...state, total: state.total + action.payload.value };

		default:
			return state;
	}
}

function calcR(nextId: string | null, hero: HeroState) {
	const current = hero.races.currentId === null ? 0 : hero.races.byId[hero.races.currentId].ap;
	const next = nextId === null ? 0 : hero.races.byId[nextId].ap;
	return next - current;
}

function calcC(nextId: string | null, hero: HeroState) {
	const current = hero.cultures.currentId === null ? 0 : hero.cultures.byId[hero.cultures.currentId].ap;
	const next = nextId === null ? 0 : hero.cultures.byId[nextId].ap;
	return next - current;
}

function calcP(nextId: string | null, hero: HeroState) {
	const current = hero.professions.currentId === null ? 0 : hero.professions.byId[hero.professions.currentId].ap;
	const next = nextId === null ? 0 : hero.professions.byId[nextId].ap;
	return next - current;
}

function calcPV(nextId: string | null, hero: HeroState) {
	const current = hero.professionVariants.currentId === null ? 0 : hero.professionVariants.byId[hero.professionVariants.currentId].ap;
	const next = nextId === null ? 0 : hero.professionVariants.byId[nextId].ap;
	return next - current;
}
