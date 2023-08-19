import { not } from "../../Data/Bool"
import { cnst, ident } from "../../Data/Function"
import { over, set } from "../../Data/Lens"
import { fromJust, fromMaybe, isJust } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { SetCombatTechniquesSortOrderAction } from "../Actions/CombatTechniquesActions"
import { SetThemeAction, SwitchEnableActiveItemHintsAction, SwitchEnableAnimationsAction, SwitchEnableEditingHeroAfterCreationPhaseAction } from "../Actions/ConfigActions"
import { SetCulturesSortOrderAction, SetCulturesVisibilityFilterAction } from "../Actions/CultureActions"
import { SwitchDisAdvRatingVisibilityAction } from "../Actions/DisAdvActions"
import { SetItemsSortOrderAction, SetMeleeItemTemplatesCombatTechniqueFilterAction, SetRangedItemTemplatesCombatTechniqueFilterAction } from "../Actions/EquipmentActions"
import { SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from "../Actions/HerolistActions"
import { ReceiveInitialDataAction } from "../Actions/InitializationActions"
import { SetLiturgicalChantsSortOrderAction } from "../Actions/LiturgicalChantActions"
import { SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction } from "../Actions/ProfessionActions"
import { SetRacesSortOrderAction } from "../Actions/RaceActions"
import {
  SwitchSheetAttributeValueVisibilityAction,
  SwitchSheetUseParchmentAction,
  SetSheetZoomFactor,
  SwitchSheetShowRules
} from "../Actions/SheetActions"
import { SetSkillsSortOrderAction, SwitchSkillRatingVisibilityAction } from "../Actions/SkillActions"
import { SetSpecialAbilitiesSortOrderAction } from "../Actions/SpecialAbilitiesActions"
import { SetSpellsSortOrderAction } from "../Actions/SpellsActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { Config, Theme } from "../Models/Config"
import { UISettingsState, UISettingsStateL } from "../Models/UISettingsState"

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
            | SwitchSheetUseParchmentAction
            | SetSheetZoomFactor
            | SetThemeAction
            | SwitchEnableEditingHeroAfterCreationPhaseAction
            | SetMeleeItemTemplatesCombatTechniqueFilterAction
            | SetRangedItemTemplatesCombatTechniqueFilterAction
            | SwitchEnableAnimationsAction
            | SwitchSheetShowRules

const CA = Config.A

const sortOrderReducer =
  (action: Action): ident<Record<UISettingsState>> => {
    switch (action.type) {
      case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
        return set (UISettingsStateL.combatTechniquesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_CULTURES_SORT_ORDER:
        return set (UISettingsStateL.culturesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_ITEMS_SORT_ORDER:
        return set (UISettingsStateL.equipmentSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_HEROLIST_SORT_ORDER:
        return set (UISettingsStateL.herolistSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_LITURGIES_SORT_ORDER:
        return set (UISettingsStateL.liturgiesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
        return set (UISettingsStateL.professionsSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_RACES_SORT_ORDER:
        return set (UISettingsStateL.racesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
        return set (UISettingsStateL.specialAbilitiesSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_SPELLS_SORT_ORDER:
        return set (UISettingsStateL.spellsSortOrder) (action.payload.sortOrder)

      case ActionTypes.SET_TALENTS_SORT_ORDER:
        return set (UISettingsStateL.talentsSortOrder) (action.payload.sortOrder)

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
            sheetUseParchment:
              fromMaybe (false) (CA.sheetUseParchment (config)),
            sheetShowRules:
              fromMaybe (false) (CA.sheetShowRules (config)),
            sheetZoomFactor:
              CA.sheetZoomFactor (config),
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
        return over (UISettingsStateL.sheetCheckAttributeValueVisibility) (not)
      case ActionTypes.SWITCH_SHEET_USE_PARCHMENT:
          return over (UISettingsStateL.sheetUseParchment) (not)
      case ActionTypes.SWITCH_SHEET_SHOW_RULES:
          return over (UISettingsStateL.sheetShowRules) (not)
      case ActionTypes.SET_SHEET_ZOOM_FACTOR:
          return set (UISettingsStateL.sheetZoomFactor) (action.payload.zoomFactor)

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
        return over (UISettingsStateL.enableActiveItemHints) (not)

      case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
        return set (UISettingsStateL.culturesVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
        return over (UISettingsStateL.advantagesDisadvantagesCultureRatingVisibility) (not)

      case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
        return set (UISettingsStateL.herolistVisibilityFilter) (action.payload.filterOption)

      case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
        return set (UISettingsStateL.professionsVisibilityFilter) (action.payload.filter)

      case ActionTypes.SET_PROFESSIONS_GR_VISIBILITY_FILTER:
        return set (UISettingsStateL.professionsGroupVisibilityFilter) (action.payload.filter)

      case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
        return over (UISettingsStateL.talentsCultureRatingVisibility) (not)

      case ActionTypes.SET_THEME:
        return set (UISettingsStateL.theme) (action.payload.theme)

      case ActionTypes.SWITCH_ENABLE_EDIT_AFTER_CREATION:
        return over (UISettingsStateL.enableEditingHeroAfterCreationPhase) (not)

      case ActionTypes.SET_MELEE_ITEM_TEMPLATES_CT_FILTER:
        return set (UISettingsStateL.meleeItemTemplatesCombatTechniqueFilter)
                   (action.payload.filterOption)

      case ActionTypes.SET_RANGED_ITEM_TEMPLATES_CT_FILTER:
        return set (UISettingsStateL.rangedItemTemplatesCombatTechniqueFilter)
                   (action.payload.filterOption)

      case ActionTypes.SWITCH_ENABLE_ANIMATIONS:
        return over (UISettingsStateL.enableAnimations) (not)

      default:
        return ident
    }
  }
