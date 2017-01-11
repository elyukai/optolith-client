import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { ValidationResult } from './RequirementsReducer';
import RaceReducer, { RaceState } from './RaceReducer';
import CultureReducer, { CultureState } from './CultureReducer';
import ProfessionReducer, { ProfessionState } from './ProfessionReducer';
import ProfessionVariantReducer, { ProfessionVariantState } from './ProfessionVariantReducer';
import rinit from '../utils/rinit';
import RequirementsReducer from './RequirementsReducer';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction;

interface Core {
	readonly id: string;
	readonly name: string | { m: string, f: string };
}

interface Dependent extends Core {
	readonly name: string;
	dependencies: (string | number | boolean)[];
	// addDependency(dependency: string | number | boolean): void;
	// removeDependency(dependency: string | number | boolean): boolean;
}

interface Increasable extends Dependent {
	value: number;
	// set(value: number): void;
	// add(value: number): void;
	// remove(value: number): void;
	// addPoint(): void;
	// removePoint(): void;
}

interface SetTierObject {
	sid: string | number | boolean,
	tier: number
}

interface Activatable extends Dependent {
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: (string | number | boolean)[][];
	readonly tiers?: number | null;
	active: boolean | (string | number | boolean | (string | number | boolean)[])[];
	// readonly isMultiselect: boolean;
	// readonly isActive: boolean;
	// readonly isActivatable: boolean;
	// readonly isDeactivatable: boolean;
	// activate(options: {
	// 	sel: string | number;
	// 	sel2: string | number;
	// 	input: string;
	// 	tier: number;
	// }): void;
	// deactivate(options: {
	// 	sid: string | number | boolean | undefined;
	// 	tier: number;
	// }): void;
	// sid: string | number | boolean | undefined;
	// tier: number | SetTierObject | undefined;
	// addDependencies(addReqs?: (string | number | boolean)[], selected?: string | number | boolean): void;
	// removeDependencies(addReqs?: (string | number | boolean)[], selected?: string | number | boolean): void;
	// reset(): void;
}

export interface Advantage extends Activatable {
	sel: (string | number | boolean)[][];
	readonly category: Categories.ADVANTAGES;
}

export interface Disadvantage extends Activatable {
	sel: (string | number | boolean)[][];
	readonly category: Categories.DISADVANTAGES;
}

export interface SpecialAbility extends Activatable {
	sel: (string | number | boolean | [string, number][] | null)[][];
	readonly gr: number;
	readonly category: Categories.SPECIAL_ABILITIES;
}

export interface Attribute extends Increasable {
	short: string;
	value: number;
	mod: number;
	readonly ic: number;
	readonly category: Categories.ATTRIBUTES;
	dependencies: number[];
	// isIncreasable: boolean;
	// isDecreasable: boolean;
	// reset(): void;
}

export interface CombatTechnique extends Increasable {
	readonly ic: number;
	readonly gr: number;
	readonly primary: string[];
	value: number;
	readonly category: Categories.COMBAT_TECHNIQUES;
	dependencies: number[];
	// at: number;
	// pa: number | string;
	// isIncreasable: boolean;
	// isDecreasable: boolean;
	// reset(): void;
}

interface Skill extends Increasable {
	ic: number;
	readonly gr: number;
}

export interface Liturgy extends Skill {
	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean;
	readonly category: Categories.LITURGIES;
	// readonly isOwnTradition: boolean;
	// readonly isIncreasable: boolean;
	// readonly isDecreasable: boolean;
	// reset(): void;
}

export interface Spell extends Skill {
	readonly check: string[];
	readonly tradition: number[];
	readonly property: number[];
	active: boolean;
	readonly category: Categories.SPELLS;
	// readonly isOwnTradition: boolean;
	// readonly isIncreasable: boolean;
	// readonly isDecreasable: boolean;
	// reset(): void;
}

export interface Talent extends Skill {
	check: string[];
	enc: string;
	spec: string[];
	spec_input: string | null;
	readonly category: Categories.TALENTS;
	dependencies: number[];
	// readonly isIncreasable: boolean;
	// readonly isDecreasable: boolean;
	// readonly isTyp: boolean;
	// readonly isUntyp: boolean;
	// reset(): void;
}

export interface AbilitiesState {
	readonly byId: {
		[id: string]: Advantage | Disadvantage | SpecialAbility | Attribute | CombatTechnique | Liturgy | Spell | Talent;
	};
	readonly allIds: string[];
	readonly attributes: string[];
	readonly combatTechniques: string[];
	readonly disAdvantages: string[];
	readonly liturgies: string[];
	readonly specialAbilities: string[];
	readonly spells: string[];
	readonly talents: string[];
}

const initialState = <AbilitiesState>{};

export default (state: AbilitiesState = initialState, action: Action, valid: ValidationResult): AbilitiesState => {
	switch (action.type) {
		case ActionTypes.RECEIVE_DATA_TABLES: {
			const { byId, allIds, byCategory } = rinit(action.payload.data);
			return { ...state, byId, allIds, ...byCategory };
		}

		case ActionTypes.RECEIVE_HERO_DATA:
			return { ...state };

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
			if (valid) {
				_activate(payload.id);
			}
			return { ...state };

		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			if (valid) {
				_deactivate(payload.id);
			}
			return { ...state };

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
			if (valid) {
				_activateDASA(payload);
			}
			return { ...state };

		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			if (valid) {
				_deactivateDASA(payload);
			}
			return { ...state };

		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.SET_SPECIALABILITY_TIER:
			if (valid) {
				_updateTier(payload.id, payload.tier, payload.sid);
			}
			return { ...state };

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
			if (valid) {
				_addPoint(payload.id);
			}
			return { ...state };

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			if (valid) {
				_removePoint(payload.id);
			}
			return { ...state };

		default:
			return state;
	}
	// if (action.type === ActionTypes.RECEIVE_DATA_TABLES) {
	// 	return { ...state, ...init(action.payload.data) as HeroState };
	// }
	// else if (action.type === ActionTypes.FETCH_CHARACTER_DATA) {
	// 	_updateAll(payload);
	// }
	// else if (action.type === ActionTypes.ASSIGN_RCP_ENTRIES) {
	// 	_assignRCP(payload.selections);
	// }
	// else if (action.type === ActionTypes.CLEAR_HERO || action.type === ActionTypes.CREATE_NEW_HERO) {
	// 	_assignRCP(payload.selections);
	// }
	// else {
	// 	const [ valid, cost, disadv ] = RequirementsReducer(state, action);
	// 	switch (action.type) {

	// 		default:
	// 			return state;
	// 	}
	// }
}
