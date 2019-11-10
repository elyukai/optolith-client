import { AppState } from "../Reducers/appReducer";
import { uiReducer } from "../Reducers/uiReducer";
import { UISettingsState } from "../Reducers/uiSettingsReducer";
import { pipe } from "../Utilities/pipe";

export const getHerolistSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.herolistSortOrder)

export const getUISettingsState =
  pipe (AppState.A_.ui, uiReducer.A_.settings)

export const getHerolistVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.herolistVisibilityFilter)

export const getRacesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.racesSortOrder)

export const getCulturesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.culturesSortOrder)

export const getCulturesVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.culturesVisibilityFilter)

export const getProfessionsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.professionsSortOrder)

export const getProfessionsVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.professionsVisibilityFilter)

export const getProfessionsGroupVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.professionsGroupVisibilityFilter)

export const getAdvantagesDisadvantagesCultureRatingVisibility =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A.advantagesDisadvantagesCultureRatingVisibility
  )

export const getSkillsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.talentsSortOrder)

export const getSkillsCultureRatingVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.talentsCultureRatingVisibility)

export const getCombatTechniquesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.combatTechniquesSortOrder)

export const getSpecialAbilitiesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.specialAbilitiesSortOrder)

export const getSpellsSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.spellsSortOrder)

export const getSpellsUnfamiliarVisibility =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.spellsUnfamiliarVisibility)

export const getLiturgiesSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.liturgiesSortOrder)

export const getEquipmentSortOrder =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.equipmentSortOrder)

export const getEquipmentGroupVisibilityFilter =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.equipmentGroupVisibilityFilter)

export const getEnableActiveItemHints =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.enableActiveItemHints)

export const getSheetCheckAttributeValueVisibility =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A.sheetCheckAttributeValueVisibility
  )

export const getTheme =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.theme)

export const getIsEditingHeroAfterCreationPhaseEnabled =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A.enableEditingHeroAfterCreationPhase
  )

export const getMeleeItemTemplateCombatTechniqueFilter =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A.meleeItemTemplatesCombatTechniqueFilter
  )

export const getRangedItemTemplateCombatTechniqueFilter =
  pipe (
    AppState.A_.ui,
    uiReducer.A_.settings,
    UISettingsState.A.rangedItemTemplatesCombatTechniqueFilter
  )

export const areAnimationsEnabled =
  pipe (AppState.A_.ui, uiReducer.A_.settings, UISettingsState.A.enableAnimations)
