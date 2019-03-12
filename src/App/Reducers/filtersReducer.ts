import { SetCombatTechniquesFilterTextAction } from '../Actions/CombatTechniquesActions';
import { SetCulturesFilterTextAction } from '../Actions/CultureActions';
import { SetActiveAdvantagesFilterTextAction, SetActiveDisadvantagesFilterTextAction, SetInactiveAdvantagesFilterTextAction, SetInactiveDisadvantagesFilterTextAction } from '../Actions/DisAdvActions';
import { SetEquipmentFilterTextAction, SetItemTemplatesFilterTextAction, SetZoneArmorFilterTextAction } from '../Actions/EquipmentActions';
import { SetHerolistFilterTextAction } from '../Actions/HerolistActions';
import { SetActiveLiturgicalChantsFilterTextAction, SetInactiveLiturgicalChantsFilterTextAction } from '../Actions/LiturgicalChantActions';
import { SetTabAction } from '../Actions/LocationActions';
import { SetProfessionsFilterTextAction } from '../Actions/ProfessionActions';
import { SetRacesFilterTextAction } from '../Actions/RaceActions';
import { SetSkillsFilterTextAction } from '../Actions/SkillActions';
import { SetActiveSpecialAbilitiesFilterTextAction, SetInactiveSpecialAbilitiesFilterTextAction } from '../Actions/SpecialAbilitiesActions';
import { SetActiveSpellsFilterTextAction, SetInactiveSpellsFilterTextAction } from '../Actions/SpellsActions';
import { ActionTypes } from '../Constants/ActionTypes';

type Action =
  SetTabAction |
  SetHerolistFilterTextAction |
  SetActiveAdvantagesFilterTextAction |
  SetActiveDisadvantagesFilterTextAction |
  SetActiveLiturgicalChantsFilterTextAction |
  SetActiveSpecialAbilitiesFilterTextAction |
  SetActiveSpellsFilterTextAction |
  SetCombatTechniquesFilterTextAction |
  SetCulturesFilterTextAction |
  SetEquipmentFilterTextAction |
  SetInactiveAdvantagesFilterTextAction |
  SetInactiveDisadvantagesFilterTextAction |
  SetInactiveDisadvantagesFilterTextAction |
  SetInactiveLiturgicalChantsFilterTextAction |
  SetInactiveSpecialAbilitiesFilterTextAction |
  SetInactiveSpellsFilterTextAction |
  SetItemTemplatesFilterTextAction |
  SetProfessionsFilterTextAction |
  SetRacesFilterTextAction |
  SetSkillsFilterTextAction |
  SetZoneArmorFilterTextAction;

export interface FiltersState {
  herolistFilterText: string;
  racesFilterText: string;
  culturesFilterText: string;
  professionsFilterText: string;
  advantagesFilterText: string;
  inactiveAdvantagesFilterText: string;
  disadvantagesFilterText: string;
  inactiveDisadvantagesFilterText: string;
  skillsFilterText: string;
  combatTechniquesFilterText: string;
  specialAbilitiesFilterText: string;
  inactiveSpecialAbilitiesFilterText: string;
  spellsFilterText: string;
  inactiveSpellsFilterText: string;
  liturgicalChantsFilterText: string;
  inactiveLiturgicalChantsFilterText: string;
  equipmentFilterText: string;
  itemTemplatesFilterText: string;
  zoneArmorFilterText: string;
  petsFilterText: string;
}

const initialState: FiltersState = {
  herolistFilterText: '',
  racesFilterText: '',
  culturesFilterText: '',
  professionsFilterText: '',
  advantagesFilterText: '',
  inactiveAdvantagesFilterText: '',
  disadvantagesFilterText: '',
  inactiveDisadvantagesFilterText: '',
  skillsFilterText: '',
  combatTechniquesFilterText: '',
  specialAbilitiesFilterText: '',
  inactiveSpecialAbilitiesFilterText: '',
  spellsFilterText: '',
  inactiveSpellsFilterText: '',
  liturgicalChantsFilterText: '',
  inactiveLiturgicalChantsFilterText: '',
  equipmentFilterText: '',
  itemTemplatesFilterText: '',
  zoneArmorFilterText: '',
  petsFilterText: '',
};

const rcpFiltersReducer = (state: FiltersState, action: Action): FiltersState => {
  switch (action.type) {
    case ActionTypes.SET_RACES_FILTER_TEXT:
      return {
        ...state,
        racesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_CULTURES_FILTER_TEXT:
      return {
        ...state,
        culturesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_PROFESSIONS_FILTER_TEXT:
      return {
        ...state,
        professionsFilterText: action.payload.filterText,
      };

    default:
      return state;
  }
};

const disAdvantageFiltersReducer = (state: FiltersState, action: Action): FiltersState => {
  switch (action.type) {
    case ActionTypes.SET_ADVANTAGES_FILTER_TEXT:
      return {
        ...state,
        advantagesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT:
      return {
        ...state,
        inactiveAdvantagesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_DISADVANTAGES_FILTER_TEXT:
      return {
        ...state,
        disadvantagesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT:
      return {
        ...state,
        inactiveDisadvantagesFilterText: action.payload.filterText,
      };

    default:
      return state;
  }
};

const abilityFiltersReducer = (state: FiltersState, action: Action): FiltersState => {
  switch (action.type) {
    case ActionTypes.SET_SKILLS_FILTER_TEXT:
      return {
        ...state,
        skillsFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT:
      return {
        ...state,
        combatTechniquesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT:
      return {
        ...state,
        specialAbilitiesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT:
      return {
        ...state,
        inactiveSpecialAbilitiesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_SPELLS_FILTER_TEXT:
      return {
        ...state,
        spellsFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT:
      return {
        ...state,
        inactiveSpellsFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT:
      return {
        ...state,
        liturgicalChantsFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT:
      return {
        ...state,
        inactiveLiturgicalChantsFilterText: action.payload.filterText,
      };

    default:
      return state;
  }
};

const belongingsFiltersReducer = (state: FiltersState, action: Action): FiltersState => {
  switch (action.type) {
    case ActionTypes.SET_EQUIPMENT_FILTER_TEXT:
      return {
        ...state,
        equipmentFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT:
      return {
        ...state,
        itemTemplatesFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT:
      return {
        ...state,
        zoneArmorFilterText: action.payload.filterText,
      };

    default:
      return state;
  }
};

export const filtersReducer = (
  state: FiltersState = initialState,
  action: Action
): FiltersState => {
  switch (action.type) {
    case ActionTypes.SET_TAB:
      return initialState;

    case ActionTypes.SET_HEROLIST_FILTER_TEXT:
      return {
        ...state,
        herolistFilterText: action.payload.filterText,
      };

    case ActionTypes.SET_RACES_FILTER_TEXT:
    case ActionTypes.SET_CULTURES_FILTER_TEXT:
    case ActionTypes.SET_PROFESSIONS_FILTER_TEXT:
      return rcpFiltersReducer (state, action);

    case ActionTypes.SET_ADVANTAGES_FILTER_TEXT:
    case ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT:
    case ActionTypes.SET_DISADVANTAGES_FILTER_TEXT:
    case ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT:
      return disAdvantageFiltersReducer (state, action);

    case ActionTypes.SET_SKILLS_FILTER_TEXT:
    case ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT:
    case ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT:
    case ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT:
    case ActionTypes.SET_SPELLS_FILTER_TEXT:
    case ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT:
    case ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT:
    case ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT:
      return abilityFiltersReducer (state, action);

    case ActionTypes.SET_EQUIPMENT_FILTER_TEXT:
    case ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT:
    case ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT:
      return belongingsFiltersReducer (state, action);

    default:
      return state;
  }
};
