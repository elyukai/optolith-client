import * as ActionTypes from '../constants/ActionTypes';
import { ReceiveDataTablesAction } from '../actions/ServerActions';
import PhaseReducer, { PhaseState } from './PhaseReducer';
import RaceReducer, { RaceState } from './RaceReducer';
import CultureReducer, { CultureState } from './CultureReducer';
import ProfessionReducer, { ProfessionState } from './ProfessionReducer';
import ProfessionVariantReducer, { ProfessionVariantState } from './ProfessionVariantReducer';
import AbilitiesReducer, { AbilitiesState } from './AbilitiesReducer';
import APReducer, { APState } from './APReducer';
import init from '../utils/init';
import RequirementsReducer from './RequirementsReducer';

export interface AdventurePoints {
	total: number;
	spent: number;
	adv: number[];
	disadv: number[];
}

interface ExperienceLevel {
	id: string;
	name: string;
	ap: number;
	maxAttributeValue: number;
	maxSkillRating: number;
	maxCombatTechniqueRating: number;
	maxTotalAttributeValues: number;
	maxSpellsLiturgies: number;
	maxUnfamiliarSpells: number;
}

interface Item {
	id: string;
	name: string;
	addpenalties: boolean;
	ammunition: string;
	at: string;
	combattechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: number;
	isTemplateLocked: boolean;
	length: string;
	number: string;
	pa: string;
	price: string;
	pro: string;
	range: string[];
	reach: string;
	reloadtime: string;
	stp: string;
	template: string;
	weight: string;
	where: string;
}

export interface HeroState {
	readonly id: string | null;
	readonly name: string;

	readonly phase: number;

	readonly ap: APState;

	readonly avatar: string;

	readonly sex: string;

	readonly family: string;
	readonly placeofbirth: string;
	readonly dateofbirth: string;
	readonly age: string;
	readonly haircolor: number;
	readonly eyecolor: number;
	readonly size: string;
	readonly weight: string;
	readonly title: string;
	readonly socialstatus: number;
	readonly characteristics: string;
	readonly otherinfo: string;

	readonly experienceLevelsById: {
		[id: string]: ExperienceLevel;
	};
	readonly experienceLevels: string[];
	readonly startExperienceLevel: string;

	readonly races: RaceState;
	readonly cultures: CultureState;
	readonly professions: ProfessionState;
	readonly professionVariants: ProfessionVariantState;

	readonly abilities: AbilitiesState;

	readonly addEnergies: {
		lp: number;
		ae: number;
		kp: number;
	};

	readonly itemTemplatesById: {
		[id: string]: Item;
	};
	readonly itemTemplates: string[];

	readonly itemsById: {
		[id: string]: Item;
	};
	readonly items: string[];

	readonly history: {
		past: Object[];
		future: Object[];
	};
}

const initialState = <HeroState>{
	// id: null,
	// name: '',

	// ap: {
	// 	spent: 0,
	// 	total: 0,
	// 	adv: [0, 0, 0],
	// 	disadv: [0, 0, 0]
	// },

	// avatar: '',

	// sex: '',

	// family: '',
	// placeofbirth: '',
	// dateofbirth: '',
	// age: '',
	// haircolor: 0,
	// eyecolor: 0,
	// size: '',
	// weight: '',
	// title: '',
	// socialstatus: 0,
	// characteristics: '',
	// otherinfo: '',

	// experienceLevelsById: {},
	// experienceLevels: [],
	// startExperienceLevel: 'EL_0',

	// abilitiesById: {},
	// abilities: [],

	// addEnergies: {
	// 	lp: 0,
	// 	ae: 0,
	// 	kp: 0
	// },

	// itemTemplatesById: {},
	// itemTemplates: [],

	// itemsById: {},
	// items: [],

	// history: {
	// 	past: [],
	// 	future: []
	// }
};

export default (state: HeroState = initialState, action: any): HeroState => {
	const validationResult = RequirementsReducer(state, action);
	return {
		id: state.id,
		name: state.name,
		phase: PhaseReducer(state.phase, action),
		ap: APReducer(state.ap, action, state, validationResult),
		avatar: state.avatar,
		sex: state.sex,
		family: state.family,
		placeofbirth: state.placeofbirth,
		dateofbirth: state.dateofbirth,
		age: state.age,
		haircolor: state.haircolor,
		eyecolor: state.eyecolor,
		size: state.size,
		weight: state.weight,
		title: state.title,
		socialstatus: state.socialstatus,
		characteristics: state.characteristics,
		otherinfo: state.otherinfo,
		experienceLevelsById: state.experienceLevelsById,
		experienceLevels: state.experienceLevels,
		startExperienceLevel: state.startExperienceLevel,
		races: RaceReducer(state.races, action),
		cultures: CultureReducer(state.cultures, action),
		professions: ProfessionReducer(state.professions, action),
		professionVariants: ProfessionVariantReducer(state.professionVariants, action),
		abilities: AbilitiesReducer(state.abilities, action, validationResult),
		addEnergies: state.addEnergies,
		itemTemplatesById: state.itemTemplatesById,
		itemTemplates: state.itemTemplates,
		itemsById: state.itemsById,
		items: state.items,
		history: state.history
	};
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
	// 		case ActionTypes.ACTIVATE_SPELL:
	// 		case ActionTypes.ACTIVATE_LITURGY:
	// 			if (valid) {
	// 				_activate(payload.id);
	// 			}
	// 			break;

	// 		case ActionTypes.DEACTIVATE_SPELL:
	// 		case ActionTypes.DEACTIVATE_LITURGY:
	// 			if (valid) {
	// 				_deactivate(payload.id);
	// 			}
	// 			break;

	// 		case ActionTypes.ACTIVATE_DISADV:
	// 		case ActionTypes.ACTIVATE_SPECIALABILITY:
	// 			if (valid) {
	// 				_activateDASA(payload);
	// 			}
	// 			break;

	// 		case ActionTypes.DEACTIVATE_DISADV:
	// 		case ActionTypes.DEACTIVATE_SPECIALABILITY:
	// 			if (valid) {
	// 				_deactivateDASA(payload);
	// 			}
	// 			break;

	// 		case ActionTypes.UPDATE_DISADV_TIER:
	// 		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
	// 			if (valid) {
	// 				_updateTier(payload.id, payload.tier, payload.sid);
	// 			}
	// 			break;

	// 		case ActionTypes.ADD_ATTRIBUTE_POINT:
	// 		case ActionTypes.ADD_TALENT_POINT:
	// 		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
	// 		case ActionTypes.ADD_SPELL_POINT:
	// 		case ActionTypes.ADD_LITURGY_POINT:
	// 			if (valid) {
	// 				_addPoint(payload.id);
	// 			}
	// 			break;

	// 		case ActionTypes.ADD_MAX_ENERGY_POINT:
	// 			break;

	// 		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
	// 		case ActionTypes.REMOVE_TALENT_POINT:
	// 		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
	// 		case ActionTypes.REMOVE_SPELL_POINT:
	// 		case ActionTypes.REMOVE_LITURGY_POINT:
	// 			if (valid) {
	// 				_removePoint(payload.id);
	// 			}
	// 			break;

	// 		default:
	// 			return state;
	// 	}
	// }
}
