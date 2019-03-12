import { SetCombatTechniquesSortOrderAction } from '../Actions/CombatTechniquesActions';
import { SetThemeAction, SwitchEnableActiveItemHintsAction, SwitchEnableAnimationsAction, SwitchEnableEditingHeroAfterCreationPhaseAction } from '../Actions/ConfigActions';
import { SetCulturesSortOrderAction, SetCulturesVisibilityFilterAction, SwitchCultureValueVisibilityAction } from '../Actions/CultureActions';
import { SwitchDisAdvRatingVisibilityAction } from '../Actions/DisAdvActions';
import { SetItemsSortOrderAction, SetMeleeItemTemplatesCombatTechniqueFilterAction, SetRangedItemTemplatesCombatTechniqueFilterAction } from '../Actions/EquipmentActions';
import { SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from '../Actions/HerolistActions';
import { ReceiveInitialDataAction } from '../Actions/IOActions';
import { SetLiturgicalChantsSortOrderAction } from '../Actions/LiturgicalChantActions';
import { SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction, SwitchProfessionsExpansionVisibilityFilterAction } from '../Actions/ProfessionActions';
import { SetRacesSortOrderAction, SwitchRaceValueVisibilityAction } from '../Actions/RaceActions';
import { SwitchSheetAttributeValueVisibilityAction } from '../Actions/SheetActions';
import { SetSkillsSortOrderAction, SwitchSkillRatingVisibilityAction } from '../Actions/SkillActions';
import { SetSpecialAbilitiesSortOrderAction } from '../Actions/SpecialAbilitiesActions';
import { SetSpellsSortOrderAction } from '../Actions/SpellsActions';
import { ActionTypes } from '../Constants/ActionTypes';
import { Maybe, Nothing } from '../utils/dataUtils';

type Action =
  ReceiveInitialDataAction |
  SetCombatTechniquesSortOrderAction |
  SwitchEnableActiveItemHintsAction |
  SetCulturesSortOrderAction |
  SetCulturesVisibilityFilterAction |
  SwitchCultureValueVisibilityAction |
  SwitchDisAdvRatingVisibilityAction |
  SetItemsSortOrderAction |
  SetHerolistSortOrderAction |
  SetHerolistVisibilityFilterAction |
  SetLiturgicalChantsSortOrderAction |
  SetProfessionsGroupVisibilityFilterAction |
  SetProfessionsSortOrderAction |
  SetProfessionsVisibilityFilterAction |
  SwitchProfessionsExpansionVisibilityFilterAction |
  SetRacesSortOrderAction |
  SwitchRaceValueVisibilityAction |
  SetSpecialAbilitiesSortOrderAction |
  SetSpellsSortOrderAction |
  SetSkillsSortOrderAction |
  SwitchSkillRatingVisibilityAction |
  SwitchSheetAttributeValueVisibilityAction |
  SetThemeAction |
  SwitchEnableEditingHeroAfterCreationPhaseAction |
  SetMeleeItemTemplatesCombatTechniqueFilterAction |
  SetRangedItemTemplatesCombatTechniqueFilterAction |
  SwitchEnableAnimationsAction;

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
  theme: string;
  enableEditingHeroAfterCreationPhase: boolean;
  meleeItemTemplatesCombatTechniqueFilter: Maybe<string>;
  rangedItemTemplatesCombatTechniqueFilter: Maybe<string>;
  enableAnimations: boolean;
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
  sheetCheckAttributeValueVisibility: false,
  theme: 'dark',
  enableEditingHeroAfterCreationPhase: false,
  enableAnimations: true,
  meleeItemTemplatesCombatTechniqueFilter: Nothing (),
  rangedItemTemplatesCombatTechniqueFilter: Nothing (),
};

function sortOrderReducer (
  state: UISettingsState,
  action: Action
): UISettingsState {
  switch (action.type) {
    case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
      return { ...state, combatTechniquesSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_CULTURES_SORT_ORDER:
      return { ...state, culturesSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_ITEMS_SORT_ORDER:
      return { ...state, equipmentSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_HEROLIST_SORT_ORDER:
      return { ...state, herolistSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_LITURGIES_SORT_ORDER:
      return { ...state, liturgiesSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
      return { ...state, professionsSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_RACES_SORT_ORDER:
      return { ...state, racesSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
      return { ...state, specialAbilitiesSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_SPELLS_SORT_ORDER:
      return { ...state, spellsSortOrder: action.payload.sortOrder };

    case ActionTypes.SET_TALENTS_SORT_ORDER:
      return { ...state, talentsSortOrder: action.payload.sortOrder };

    default:
      return state;
  }
}

export function uiSettingsReducer (
  state: UISettingsState = initialState,
  action: Action
): UISettingsState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      if (action.payload.config) {
        const {
          locale: _,
          ...config
        } = action.payload.config;

        return {
          ...state,
          ...config,
          meleeItemTemplatesCombatTechniqueFilter:
            Maybe.normalize (config.meleeItemTemplatesCombatTechniqueFilter),
          rangedItemTemplatesCombatTechniqueFilter:
            Maybe.normalize (config.rangedItemTemplatesCombatTechniqueFilter),
        };
      }

      return state;
    }

    case ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY:
      return {
        ...state,
        sheetCheckAttributeValueVisibility: !state.sheetCheckAttributeValueVisibility,
      };

    case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
    case ActionTypes.SET_CULTURES_SORT_ORDER:
    case ActionTypes.SET_ITEMS_SORT_ORDER:
    case ActionTypes.SET_HEROLIST_SORT_ORDER:
    case ActionTypes.SET_LITURGIES_SORT_ORDER:
    case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
    case ActionTypes.SET_RACES_SORT_ORDER:
    case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
    case ActionTypes.SET_SPELLS_SORT_ORDER:
    case ActionTypes.SET_TALENTS_SORT_ORDER:
      return sortOrderReducer (state, action);

    case ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS:
      return { ...state, enableActiveItemHints: !state.enableActiveItemHints };

    case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
      return { ...state, culturesValueVisibility: !state.culturesValueVisibility };

    case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
      return { ...state, culturesVisibilityFilter: action.payload.filter };

    case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
      return {
        ...state,
        advantagesDisadvantagesCultureRatingVisibility:
          !state.advantagesDisadvantagesCultureRatingVisibility,
      };

    case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
      return { ...state, herolistVisibilityFilter: action.payload.filterOption };

    case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
      return { ...state, professionsVisibilityFilter: action.payload.filter };

    case ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER:
      return { ...state, professionsGroupVisibilityFilter: action.payload.filter };

    case ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER:
      return {
        ...state,
        professionsFromExpansionsVisibility: !state.professionsFromExpansionsVisibility,
      };

    case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
      return { ...state, racesValueVisibility: !state.racesValueVisibility };

    case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
      return { ...state, talentsCultureRatingVisibility: !state.talentsCultureRatingVisibility };

    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload.theme };

    case ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE:
      return {
        ...state,
        enableEditingHeroAfterCreationPhase: !state.enableEditingHeroAfterCreationPhase,
      };

    case ActionTypes.SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER:
      return { ...state, meleeItemTemplatesCombatTechniqueFilter: action.payload.filterOption };

    case ActionTypes.SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER:
      return { ...state, rangedItemTemplatesCombatTechniqueFilter: action.payload.filterOption };

    case ActionTypes.SWITCH_ENABLE_ANIMATIONS:
      return { ...state, enableAnimations: !state.enableAnimations };

    default:
      return state;
  }
}
