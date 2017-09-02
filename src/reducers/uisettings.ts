import { SetCombatTechniquesSortOrderAction } from '../actions/CombatTechniquesActions';
import { SwitchEnableActiveItemHintsAction } from '../actions/ConfigActions';
import { SetCulturesSortOrderAction, SetCulturesVisibilityFilterAction, SwitchCultureValueVisibilityAction } from '../actions/CultureActions';
import { SwitchDisAdvRatingVisibilityAction } from '../actions/DisAdvActions';
import { SetItemsSortOrderAction } from '../actions/EquipmentActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from '../actions/HerolistActions';
import { SetLiturgiesSortOrderAction } from '../actions/LiturgiesActions';
import { SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction, SwitchProfessionsExpansionVisibilityFilterAction } from '../actions/ProfessionActions';
import { SetRacesSortOrderAction, SwitchRaceValueVisibilityAction } from '../actions/RaceActions';
import { SwitchSheetAttributeValueVisibilityAction } from '../actions/SheetActions';
import { SetSpecialAbilitiesSortOrderAction } from '../actions/SpecialAbilitiesActions';
import { SetSpellsSortOrderAction } from '../actions/SpellsActions';
import { SetTalentsSortOrderAction, SwitchTalentRatingVisibilityAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveInitialDataAction | SetCombatTechniquesSortOrderAction | SwitchEnableActiveItemHintsAction | SetCulturesSortOrderAction | SetCulturesVisibilityFilterAction | SwitchCultureValueVisibilityAction | SwitchDisAdvRatingVisibilityAction | SetItemsSortOrderAction | SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | SetLiturgiesSortOrderAction | SetProfessionsGroupVisibilityFilterAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction | SwitchProfessionsExpansionVisibilityFilterAction | SetRacesSortOrderAction | SwitchRaceValueVisibilityAction | SetSpecialAbilitiesSortOrderAction | SetSpellsSortOrderAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction | SwitchSheetAttributeValueVisibilityAction;

export interface UISettingsState {
	herolistSortOrder: string;
	herolistVisibilityFilter: string;
	racesSortOrder: string;
	racesValueVisibility: boolean;
	culturesSortOrder: string;
	culturesVisibilityFilter: string;
	culturesValueVisibility: boolean;
	professionsSortOrder: string;
	professionsVisibilityFilter: string;
	professionsGroupVisibilityFilter: number;
	professionsFromExpansionsVisibility: boolean;
	advantagesDisadvantagesCultureRatingVisibility: boolean;
	talentsSortOrder: string;
	talentsCultureRatingVisibility: boolean;
	combatTechniquesSortOrder: string;
	specialAbilitiesSortOrder: string;
	spellsSortOrder: string;
	spellsUnfamiliarVisibility: boolean;
	liturgiesSortOrder: string;
	equipmentSortOrder: string;
	equipmentGroupVisibilityFilter: number;
	enableActiveItemHints: boolean;
	sheetCheckAttributeValueVisibility: boolean;
}

const initialState: UISettingsState = {
	herolistSortOrder: 'name',
	herolistVisibilityFilter: 'all',
	racesSortOrder: 'name',
	racesValueVisibility: true,
	culturesSortOrder: 'name',
	culturesVisibilityFilter: 'common',
	culturesValueVisibility: false,
	professionsSortOrder: 'name',
	professionsVisibilityFilter: 'common',
	professionsGroupVisibilityFilter: 0,
	professionsFromExpansionsVisibility: false,
	advantagesDisadvantagesCultureRatingVisibility: false,
	talentsSortOrder: 'group',
	talentsCultureRatingVisibility: false,
	combatTechniquesSortOrder: 'name',
	specialAbilitiesSortOrder: 'group',
	spellsSortOrder: 'name',
	spellsUnfamiliarVisibility: false,
	liturgiesSortOrder: 'name',
	equipmentSortOrder: 'name',
	equipmentGroupVisibilityFilter: 1,
	enableActiveItemHints: false,
	sheetCheckAttributeValueVisibility: false
};

export function uisettings(state: UISettingsState = initialState, action: Action): UISettingsState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA: {
			const { locale: _, sheetCheckAttributeValueVisibility = false, ...config } = action.payload.config;
			return { ...config, sheetCheckAttributeValueVisibility };
		}

		case ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY:
			return { ...state, sheetCheckAttributeValueVisibility: !state.sheetCheckAttributeValueVisibility };

		case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
			return { ...state, combatTechniquesSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS:
			return { ...state, enableActiveItemHints: !state.enableActiveItemHints };

		case ActionTypes.SET_CULTURES_SORT_ORDER:
			return { ...state, culturesSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
			return { ...state, culturesValueVisibility: !state.culturesValueVisibility };

		case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
			return { ...state, culturesVisibilityFilter: action.payload.filter };

		case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
			return { ...state, advantagesDisadvantagesCultureRatingVisibility: !state.advantagesDisadvantagesCultureRatingVisibility };

		case ActionTypes.SET_ITEMS_SORT_ORDER:
			return { ...state, equipmentSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_HEROLIST_SORT_ORDER:
			return { ...state, herolistSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
			return { ...state, herolistVisibilityFilter: action.payload.filterOption };

		case ActionTypes.SET_LITURGIES_SORT_ORDER:
			return { ...state, liturgiesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
			return { ...state, professionsSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
			return { ...state, professionsVisibilityFilter: action.payload.filter };

		case ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER:
			return { ...state, professionsGroupVisibilityFilter: action.payload.filter };

		case ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER:
			return { ...state, professionsFromExpansionsVisibility: !state.professionsFromExpansionsVisibility };

		case ActionTypes.SET_RACES_SORT_ORDER:
			return { ...state, racesSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
			return { ...state, racesValueVisibility: !state.racesValueVisibility };

		case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
			return { ...state, specialAbilitiesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_SPELLS_SORT_ORDER:
			return { ...state, spellsSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_TALENTS_SORT_ORDER:
			return { ...state, talentsSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
			return { ...state, talentsCultureRatingVisibility: !state.talentsCultureRatingVisibility };

		default:
			return state;
	}
}
