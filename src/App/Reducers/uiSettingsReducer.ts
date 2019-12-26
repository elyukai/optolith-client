import { not } from "../../Data/Bool";
import { cnst, ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { fromJust, fromMaybe, isJust, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetCombatTechniquesSortOrderAction } from "../Actions/CombatTechniquesActions";
import { SetThemeAction, SwitchEnableActiveItemHintsAction, SwitchEnableAnimationsAction, SwitchEnableEditingHeroAfterCreationPhaseAction } from "../Actions/ConfigActions";
import { SetCulturesSortOrderAction, SetCulturesVisibilityFilterAction } from "../Actions/CultureActions";
import { SwitchDisAdvRatingVisibilityAction } from "../Actions/DisAdvActions";
import { SetItemsSortOrderAction, SetMeleeItemTemplatesCombatTechniqueFilterAction, SetRangedItemTemplatesCombatTechniqueFilterAction } from "../Actions/EquipmentActions";
import { SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from "../Actions/HerolistActions";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { SetLiturgicalChantsSortOrderAction } from "../Actions/LiturgicalChantActions";
import { SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction } from "../Actions/ProfessionActions";
import { SetRacesSortOrderAction } from "../Actions/RaceActions";
import { SwitchSheetAttributeValueVisibilityAction } from "../Actions/SheetActions";
import { SetSkillsSortOrderAction, SwitchSkillRatingVisibilityAction } from "../Actions/SkillActions";
import { SetSpecialAbilitiesSortOrderAction } from "../Actions/SpecialAbilitiesActions";
import { SetSpellsSortOrderAction } from "../Actions/SpellsActions";
import * as ActionTypes from "../Constants/ActionTypes";
import { EquipmentGroup } from "../Constants/Groups";
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids";
import { ChantsSortOptions, CombatTechniquesSortOptions, Config, CulturesSortOptions, CulturesVisibilityFilter, EquipmentSortOptions, HeroListSortOptions, HeroListVisibilityFilter, ProfessionsGroupVisibilityFilter, ProfessionsSortOptions, ProfessionsVisibilityFilter, RacesSortOptions, SkillsSortOptions, SpecialAbilitiesSortOptions, SpellsSortOptions, Theme } from "../Utilities/Raw/JSON/Config";
import { SortNames } from "../Views/Universal/SortOptions";

type Action = ReceiveInitialDataAction
            | SetCombatTechniquesSortOrderAction
            | SwitchEnableActiveItemHintsAction
            | SetCulturesSortOrderAction
            | SetCulturesVisibilityFilterAction
            | SwitchDisAdvRatingVisibilityAction
            | SetItemsSortOrderAction
            | SetHerolistSortOrderAction
            | SetHerolistVisibilityFilterAction
            | SetLiturgicalChantsSortOrderAction
            | SetProfessionsGroupVisibilityFilterAction
            | SetProfessionsSortOrderAction
            | SetProfessionsVisibilityFilterAction
            | SetRacesSortOrderAction
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
  herolistSortOrder: HeroListSortOptions
  herolistVisibilityFilter: HeroListVisibilityFilter
  racesSortOrder: RacesSortOptions
  culturesSortOrder: CulturesSortOptions
  culturesVisibilityFilter: CulturesVisibilityFilter
  professionsSortOrder: ProfessionsSortOptions
  professionsVisibilityFilter: ProfessionsVisibilityFilter
  professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: SkillsSortOptions
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: CombatTechniquesSortOptions
  specialAbilitiesSortOrder: SpecialAbilitiesSortOptions
  spellsSortOrder: SpellsSortOptions
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: ChantsSortOptions
  equipmentSortOrder: EquipmentSortOptions
  equipmentGroupVisibilityFilter: EquipmentGroup
  enableActiveItemHints: boolean
  sheetCheckAttributeValueVisibility: boolean
  theme: Theme
  enableEditingHeroAfterCreationPhase: boolean
  meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  enableAnimations: boolean
}

export const UISettingsState =
  fromDefault ("UISettingsState")
              <UISettingsState> ({
                herolistSortOrder: SortNames.Name,
                herolistVisibilityFilter: HeroListVisibilityFilter.All,
                racesSortOrder: SortNames.Name,
                culturesSortOrder: SortNames.Name,
                culturesVisibilityFilter: CulturesVisibilityFilter.Common,
                professionsSortOrder: SortNames.Name,
                professionsVisibilityFilter: ProfessionsVisibilityFilter.Common,
                professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter.All,
                advantagesDisadvantagesCultureRatingVisibility: false,
                talentsSortOrder: SortNames.Group,
                talentsCultureRatingVisibility: false,
                combatTechniquesSortOrder: SortNames.Name,
                specialAbilitiesSortOrder: SortNames.GroupName,
                spellsSortOrder: SortNames.Name,
                spellsUnfamiliarVisibility: false,
                liturgiesSortOrder: SortNames.Name,
                equipmentSortOrder: SortNames.Name,
                equipmentGroupVisibilityFilter: EquipmentGroup.MeleeWeapons,
                enableActiveItemHints: false,
                sheetCheckAttributeValueVisibility: false,
                theme: Theme.Dark,
                enableEditingHeroAfterCreationPhase: false,
                enableAnimations: true,
                meleeItemTemplatesCombatTechniqueFilter: Nothing,
                rangedItemTemplatesCombatTechniqueFilter: Nothing,
              })

const L = makeLenses (UISettingsState)

const CA = Config.A

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
          const config = fromJust (action.payload.config)

          return cnst (UISettingsState ({
            herolistSortOrder: CA.herolistSortOrder (config),
            herolistVisibilityFilter: CA.herolistVisibilityFilter (config),
            racesSortOrder: CA.racesSortOrder (config),
            culturesSortOrder: CA.culturesSortOrder (config),
            culturesVisibilityFilter: CA.culturesVisibilityFilter (config),
            professionsSortOrder: CA.professionsSortOrder (config),
            professionsVisibilityFilter: CA.professionsVisibilityFilter (config),
            professionsGroupVisibilityFilter: CA.professionsGroupVisibilityFilter (config),
            advantagesDisadvantagesCultureRatingVisibility:
              CA.advantagesDisadvantagesCultureRatingVisibility (config),
            talentsSortOrder: CA.talentsSortOrder (config),
            talentsCultureRatingVisibility: CA.talentsCultureRatingVisibility (config),
            combatTechniquesSortOrder: CA.combatTechniquesSortOrder (config),
            specialAbilitiesSortOrder: CA.specialAbilitiesSortOrder (config),
            spellsSortOrder: CA.spellsSortOrder (config),
            spellsUnfamiliarVisibility: CA.spellsUnfamiliarVisibility (config),
            liturgiesSortOrder: CA.liturgiesSortOrder (config),
            equipmentSortOrder: CA.equipmentSortOrder (config),
            equipmentGroupVisibilityFilter: CA.equipmentGroupVisibilityFilter (config),
            enableActiveItemHints: CA.enableActiveItemHints (config),
            sheetCheckAttributeValueVisibility:
              fromMaybe (false) (CA.sheetCheckAttributeValueVisibility (config)),
            theme: fromMaybe (Theme.Dark) (CA.theme (config)),
            enableEditingHeroAfterCreationPhase:
              fromMaybe (false) (CA.enableEditingHeroAfterCreationPhase (config)),
            meleeItemTemplatesCombatTechniqueFilter:
              CA.meleeItemTemplatesCombatTechniqueFilter (config),
            rangedItemTemplatesCombatTechniqueFilter:
              CA.rangedItemTemplatesCombatTechniqueFilter (config),
            enableAnimations: fromMaybe (true) (CA.enableAnimations (config)),
          }))
        }

        return ident
      }

      case ActionTypes.SWITCH_SHEET_ATTR_VALUE_VISIBILITY:
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

      case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
        return set (L.culturesVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
        return over (L.advantagesDisadvantagesCultureRatingVisibility) (not)

      case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
        return set (L.herolistVisibilityFilter) (action.payload.filterOption)

      case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
        return set (L.professionsVisibilityFilter) (action.payload.filter)

      case ActionTypes.SET_PROFESSIONS_GR_VISIBILITY_FILTER:
        return set (L.professionsGroupVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
        return over (L.talentsCultureRatingVisibility) (not)

      case ActionTypes.SET_THEME:
        return set (L.theme) (action.payload.theme)

      case ActionTypes.SWITCH_ENABLE_EDIT_AFTER_CREATION:
        return over (L.enableEditingHeroAfterCreationPhase) (not)

      case ActionTypes.SET_MELEE_ITEM_TEMPLATES_CT_FILTER:
        return set (L.meleeItemTemplatesCombatTechniqueFilter) (action.payload.filterOption)

      case ActionTypes.SET_RANGED_ITEM_TEMPLATES_CT_FILTER:
        return set (L.rangedItemTemplatesCombatTechniqueFilter) (action.payload.filterOption)

      case ActionTypes.SWITCH_ENABLE_ANIMATIONS:
        return over (L.enableAnimations) (not)

      default:
        return ident
    }
  }
