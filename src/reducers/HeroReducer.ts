import { fromJS, Map } from 'immutable';
import * as ActionTypes from '../constants/ActionTypes';
import { FetchDataTablesAction } from '../actions/ServerActions';
import init from '../utils/init';
import RequirementsReducer from './RequirementsReducer';

type Action = FetchDataTablesAction;

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

interface CoreInstance {
	readonly id: string;
	readonly name: string | { m: string, f: string };
}

interface DependentInstance extends CoreInstance {
	readonly name: string;
	dependencies: (string | number | boolean)[];
	addDependency(dependency: string | number | boolean): void;
	removeDependency(dependency: string | number | boolean): boolean;
}

interface IncreasableInstance extends DependentInstance {
	value: number;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
}

interface SetTierObject {
	sid: string | number | boolean,
	tier: number
}

interface ActivatableInstance extends DependentInstance {
	readonly cost: number;
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | number | boolean)[][];
	readonly tiers: number;
	readonly gr: number;
	active: boolean | (string | number | boolean | (string | number | boolean)[])[];
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(options: {
		sel: string | number;
		sel2: string | number;
		input: string;
		tier: number;
	}): void;
	deactivate(options: {
		sid: string | number | boolean | undefined;
		tier: number;
	}): void;
	sid: string | number | boolean | undefined;
	tier: number | SetTierObject | undefined;
	addDependencies(addReqs?: (string | number | boolean)[], selected?: string | number | boolean): void;
	removeDependencies(addReqs?: (string | number | boolean)[], selected?: string | number | boolean): void;
	reset(): void;
}

interface AdvantageInstance extends ActivatableInstance {
	readonly category: string;
}

interface DisadvantageInstance extends ActivatableInstance {
	readonly category: string;
}

interface SpecialAbilityInstance extends ActivatableInstance {
	readonly category: string;
}

interface AttributeInstance extends IncreasableInstance {
	short: string;
	value: number;
	mod: number;
	readonly ic: number;
	readonly category: string;
	dependencies: number[];
	isIncreasable: boolean;
	isDecreasable: boolean;
	reset(): void;
}

interface CombatTechniqueInstance extends IncreasableInstance {
	readonly ic: number;
	readonly gr: number;
	readonly primary: string[];
	value: number;
	readonly category: string;
	dependencies: number[];
	at: number;
	pa: number | string;
	isIncreasable: boolean;
	isDecreasable: boolean;
	reset(): void;
}

interface SkillInstance extends IncreasableInstance {
	ic: number;
	readonly gr: number;
}

interface LiturgyInstance extends SkillInstance {
	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean;
	readonly category: string;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	reset(): void;
}

interface SpellInstance extends SkillInstance {
	readonly check: string[];
	readonly tradition: number[];
	readonly property: number[];
	active: boolean;
	readonly category: string;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	reset(): void;
}

interface TalentInstance extends SkillInstance {
	check: string[];
	enc: string;
	spec: string[];
	spec_input: string | null;
	readonly category: string;
	dependencies: number[];
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	readonly isTyp: boolean;
	readonly isUntyp: boolean;
	reset(): void;
}

interface CultureInstance extends CoreInstance {
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
	readonly category: string;
}

interface ProfessionInstance extends CoreInstance {
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
	readonly category: string;
}

interface ProfessionVariantInstance extends CoreInstance {
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
}

interface RaceInstance extends CoreInstance {
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

interface ItemInstance extends CoreInstance {
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
	name: string;
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
	readonly heroId: string | null;
	readonly heroName: string;

	readonly phase: number;

	readonly ap: AdventurePoints;

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

	readonly racesById: {
		[id: string]: RaceInstance;
	};
	readonly races: string[];
	readonly currentRace: string | null;

	readonly culturesById: {
		[id: string]: CultureInstance;
	};
	readonly cultures: string[];
	readonly currentCulture: string | null;

	readonly professionsById: {
		[id: string]: ProfessionInstance;
	};
	readonly professions: string[];
	readonly currentProfession: string | null;

	readonly professionVariantsById: {
		[id: string]: ProfessionVariantInstance;
	};
	readonly professionVariants: string[];
	readonly currentProfessionVariants: string | null;

	readonly abilitiesById: {
		[id: string]: AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance;
	};
	readonly abilities: string[];

	readonly addEnergies: {
		lp: number;
		ae: number;
		kp: number;
	};

	readonly itemTemplatesById: {
		[id: string]: ItemInstance;
	};
	readonly itemTemplates: string[];

	readonly itemsById: {
		[id: string]: ItemInstance;
	};
	readonly items: string[];

	readonly history: {
		past: Object[];
		future: Object[];
	};
}

const initialState = <HeroState>{
	heroId: null,
	heroName: '',

	phase: 0,

	ap: {
		spent: 0,
		total: 0,
		adv: [0, 0, 0],
		disadv: [0, 0, 0]
	},

	avatar: '',

	sex: '',

	family: '',
	placeofbirth: '',
	dateofbirth: '',
	age: '',
	haircolor: 0,
	eyecolor: 0,
	size: '',
	weight: '',
	title: '',
	socialstatus: 0,
	characteristics: '',
	otherinfo: '',

	experienceLevelsById: {},
	experienceLevels: [],
	startExperienceLevel: 'EL_0',

	racesById: {},
	races: [],
	currentRace: null,

	culturesById: {},
	cultures: [],
	currentCulture: null,

	professionsById: {},
	professions: [],
	currentProfession: null,

	professionVariantsById: {},
	professionVariants: [],
	currentProfessionVariants: null,

	abilitiesById: {},
	abilities: [],

	addEnergies: {
		lp: 0,
		ae: 0,
		kp: 0
	},

	itemTemplatesById: {},
	itemTemplates: [],

	itemsById: {},
	items: [],

	history: {
		past: [],
		future: []
	}
};

export default (state = initialState, action: Action) => {
	if (action.type === ActionTypes.FETCH_DATA_TABLES) {
		return { ...state, ...init(action.payload.data) as HeroState };
	}
	else if (action.type === ActionTypes.FETCH_CHARACTER_DATA) {
		_updateAll(payload);
	}
	else if (action.type === ActionTypes.ASSIGN_RCP_ENTRIES) {
		_assignRCP(payload.selections);
	}
	else if (action.type === ActionTypes.CLEAR_HERO || action.type === ActionTypes.CREATE_NEW_HERO) {
		_assignRCP(payload.selections);
	}
	else {
		const [ valid, cost, disadv ] = RequirementsReducer(state, action);
		switch (action.type) {
			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY:
				if (valid) {
					_activate(payload.id);
				}
				break;

			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				if (valid) {
					_deactivate(payload.id);
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
				if (valid) {
					_activateDASA(payload);
				}
				break;

			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (valid) {
					_deactivateDASA(payload);
				}
				break;

			case ActionTypes.UPDATE_DISADV_TIER:
			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				if (valid) {
					_updateTier(payload.id, payload.tier, payload.sid);
				}
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				if (valid) {
					_addPoint(payload.id);
				}
				break;

			case ActionTypes.ADD_MAX_ENERGY_POINT:
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (valid) {
					_removePoint(payload.id);
				}
				break;

			default:
				return state;
		}
	}
}
