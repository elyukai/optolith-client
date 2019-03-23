import { AppState } from "../Reducers/appReducer";
import { uiReducer } from "../Reducers/uiReducer";
import { UISettingsState } from "../Reducers/uiSettingsReducer";
import { pipe } from "../Utilities/pipe";

export const getHerolistSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.herolistSortOrder)

export const getUISettingsState =
  pipe (AppState.A_.ui, uiReducer.A_.settings)

export const getHerolistVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.herolistVisibilityFilter)

export const getRacesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.racesSortOrder)

export const getRacesValueVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.racesValueVisibility)

export const getCulturesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.culturesSortOrder)

export const getCulturesVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.culturesVisibilityFilter)

export const getCulturesValueVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.culturesValueVisibility)

export const getProfessionsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.professionsSortOrder)

export const getProfessionsVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.professionsVisibilityFilter)

export const getProfessionsGroupVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.professionsGroupVisibilityFilter)

export const getProfessionsFromExpansionsVisibility =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.professionsFromExpansionsVisibility
  )

export const getAdvantagesDisadvantagesCultureRatingVisibility =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.advantagesDisadvantagesCultureRatingVisibility
  )

export const getSkillsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.talentsSortOrder)

export const getSkillsCultureRatingVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.talentsCultureRatingVisibility)

export const getCombatTechniquesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.combatTechniquesSortOrder)

export const getSpecialAbilitiesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.specialAbilitiesSortOrder)

export const getSpellsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.spellsSortOrder)

export const getSpellsUnfamiliarVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.spellsUnfamiliarVisibility)

export const getLiturgiesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.liturgiesSortOrder)

export const getEquipmentSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.equipmentSortOrder)

export const getEquipmentGroupVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.equipmentGroupVisibilityFilter)

export const getEnableActiveItemHints =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.enableActiveItemHints)

export const getSheetCheckAttributeValueVisibility =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.sheetCheckAttributeValueVisibility
  )

export const getTheme =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.theme)

export const getIsEditingHeroAfterCreationPhaseEnabled =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.enableEditingHeroAfterCreationPhase
  )

export const getMeleeItemTemplateCombatTechniqueFilter =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.meleeItemTemplatesCombatTechniqueFilter
  )

export const getRangedItemTemplateCombatTechniqueFilter =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A_.rangedItemTemplatesCombatTechniqueFilter
  )

export const areAnimationsEnabled =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A_.enableAnimations)
