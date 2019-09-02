import { not } from "../../Data/Bool";
import { cnst, ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { fromJust, fromMaybe, isJust, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetCombatTechniquesSortOrderAction } from "../Actions/CombatTechniquesActions";
import { SetThemeAction, SwitchEnableActiveItemHintsAction, SwitchEnableAnimationsAction, SwitchEnableEditingHeroAfterCreationPhaseAction } from "../Actions/ConfigActions";
import { SetCulturesSortOrderAction, SetCulturesVisibilityFilterAction, SwitchCultureValueVisibilityAction } from "../Actions/CultureActions";
import { SwitchDisAdvRatingVisibilityAction } from "../Actions/DisAdvActions";
import { SetItemsSortOrderAction, SetMeleeItemTemplatesCombatTechniqueFilterAction, SetRangedItemTemplatesCombatTechniqueFilterAction } from "../Actions/EquipmentActions";
import { SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from "../Actions/HerolistActions";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { SetLiturgicalChantsSortOrderAction } from "../Actions/LiturgicalChantActions";
import { SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction, SwitchProfessionsExpansionVisibilityFilterAction } from "../Actions/ProfessionActions";
import { SetRacesSortOrderAction, SwitchRaceValueVisibilityAction } from "../Actions/RaceActions";
import { SwitchSheetAttributeValueVisibilityAction } from "../Actions/SheetActions";
import { SetSkillsSortOrderAction, SwitchSkillRatingVisibilityAction } from "../Actions/SkillActions";
import { SetSpecialAbilitiesSortOrderAction } from "../Actions/SpecialAbilitiesActions";
import { SetSpellsSortOrderAction } from "../Actions/SpellsActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { SortNames } from "../Views/Universal/SortOptions";

type Action = ReceiveInitialDataAction
            | SetCombatTechniquesSortOrderAction
            | SwitchEnableActiveItemHintsAction
            | SetCulturesSortOrderAction
            | SetCulturesVisibilityFilterAction
            | SwitchCultureValueVisibilityAction
            | SwitchDisAdvRatingVisibilityAction
            | SetItemsSortOrderAction
            | SetHerolistSortOrderAction
            | SetHerolistVisibilityFilterAction
            | SetLiturgicalChantsSortOrderAction
            | SetProfessionsGroupVisibilityFilterAction
            | SetProfessionsSortOrderAction
            | SetProfessionsVisibilityFilterAction
            | SwitchProfessionsExpansionVisibilityFilterAction
            | SetRacesSortOrderAction
            | SwitchRaceValueVisibilityAction
            | SetSpecialAbilitiesSortOrderAction
            | SetSpellsSortOrderAction
            | SetSkillsSortOrderAction
            | SwitchSkillRatingVisibilityAction
            | SwitchSheetAttributeValueVisibilityAction
            | SetThemeAction
            | SwitchEnableEditingHeroAfterCreationPhaseAction
            | SetMeleeItemTemplatesCombatTechniqueFilterAction
            | SetRangedItemTemplatesCombatTechniqueFilterAction
            | SwitchEnableAnimationsAction

export interface UISettingsState {
  "@@name": "UISettingsState"
  herolistSortOrder: SortNames
  herolistVisibilityFilter: string
  racesSortOrder: SortNames
  racesValueVisibility: boolean
  culturesSortOrder: SortNames
  culturesVisibilityFilter: string
  culturesValueVisibility: boolean
  professionsSortOrder: SortNames
  professionsVisibilityFilter: string
  professionsGroupVisibilityFilter: number
  professionsFromExpansionsVisibility: boolean
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: SortNames
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: SortNames
  specialAbilitiesSortOrder: SortNames
  spellsSortOrder: SortNames
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: SortNames
  equipmentSortOrder: SortNames
  equipmentGroupVisibilityFilter: number
  enableActiveItemHints: boolean
  sheetCheckAttributeValueVisibility: boolean
  theme: string
  enableEditingHeroAfterCreationPhase: boolean
  meleeItemTemplatesCombatTechniqueFilter: Maybe<string>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<string>
  enableAnimations: boolean
}

export const UISettingsState =
  fromDefault ("UISettingsState")
              <UISettingsState> ({
                herolistSortOrder: "name",
                herolistVisibilityFilter: "all",
                racesSortOrder: "name",
                racesValueVisibility: true,
                culturesSortOrder: "name",
                culturesVisibilityFilter: "common",
                culturesValueVisibility: false,
                professionsSortOrder: "name",
                professionsVisibilityFilter: "common",
                professionsGroupVisibilityFilter: 0,
                professionsFromExpansionsVisibility: false,
                advantagesDisadvantagesCultureRatingVisibility: false,
                talentsSortOrder: "group",
                talentsCultureRatingVisibility: false,
                combatTechniquesSortOrder: "name",
                specialAbilitiesSortOrder: "group",
                spellsSortOrder: "name",
                spellsUnfamiliarVisibility: false,
                liturgiesSortOrder: "name",
                equipmentSortOrder: "name",
                equipmentGroupVisibilityFilter: 1,
                enableActiveItemHints: false,
                sheetCheckAttributeValueVisibility: false,
                theme: "dark",
                enableEditingHeroAfterCreationPhase: false,
                enableAnimations: true,
                meleeItemTemplatesCombatTechniqueFilter: Nothing,
                rangedItemTemplatesCombatTechniqueFilter: Nothing,
              })

const L = makeLenses (UISettingsState)

const sortOrderReducer =
  (action: Action): ident<Record<UISettingsState>> => {
    switch (action.type) {
      case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
        return set (L.combatTechniquesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_CULTURES_SORT_ORDER:
        return set (L.culturesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_ITEMS_SORT_ORDER:
        return set (L.equipmentSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_HEROLIST_SORT_ORDER:
        return set (L.herolistSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_LITURGIES_SORT_ORDER:
        return set (L.liturgiesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
        return set (L.professionsSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_RACES_SORT_ORDER:
        return set (L.racesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
        return set (L.specialAbilitiesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_SPELLS_SORT_ORDER:
        return set (L.spellsSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_TALENTS_SORT_ORDER:
        return set (L.talentsSortOrder) (action.payload.sortOrder)

      default:
        return ident
    }
  }

export const uiSettingsReducer =
  (action: Action): ident<Record<UISettingsState>> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        if (isJust (action.payload.config)) {
          const {
            locale: _,
            ...config
          } = fromJust (action.payload.config)

          return cnst (UISettingsState ({
            ...config,
            enableAnimations:
              fromMaybe (true) (Maybe (config.enableAnimations)),
            enableEditingHeroAfterCreationPhase:
              fromMaybe (false) (Maybe (config.enableEditingHeroAfterCreationPhase)),
            theme:
              fromMaybe ("dark") (Maybe (config.theme)),
            sheetCheckAttributeValueVisibility:
              fromMaybe (false) (Maybe (config.sheetCheckAttributeValueVisibility)),
            meleeItemTemplatesCombatTechniqueFilter:
              Maybe.normalize (config.meleeItemTemplatesCombatTechniqueFilter),
            rangedItemTemplatesCombatTechniqueFilter:
              Maybe.normalize (config.rangedItemTemplatesCombatTechniqueFilter),
          }))
        }

        return ident
      }

      case ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY:
        return over (L.sheetCheckAttributeValueVisibility) (not)

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
        return sortOrderReducer (action)

      case ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS:
        return over (L.enableActiveItemHints) (not)

      case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
        return over (L.culturesValueVisibility) (not)

      case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
        return set (L.culturesVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
        return over (L.advantagesDisadvantagesCultureRatingVisibility) (not)

      case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
        return set (L.herolistVisibilityFilter) (action.payload.filterOption)

      case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
        return set (L.professionsVisibilityFilter) (action.payload.filter)

      case ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER:
        return set (L.professionsGroupVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER:
        return over (L.professionsFromExpansionsVisibility) (not)

      case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
        return over (L.racesValueVisibility) (not)

      case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
        return over (L.talentsCultureRatingVisibility) (not)

      case ActionTypes.SET_THEME:
        return set (L.theme) (action.payload.theme)

      case ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE:
        return over (L.enableEditingHeroAfterCreationPhase) (not)

      case ActionTypes.SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER:
        return set (L.meleeItemTemplatesCombatTechniqueFilter) (action.payload.filterOption)

      case ActionTypes.SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER:
        return set (L.rangedItemTemplatesCombatTechniqueFilter) (action.payload.filterOption)

      case ActionTypes.SWITCH_ENABLE_ANIMATIONS:
        return over (L.enableAnimations) (not)

      default:
        return ident
    }
  }
