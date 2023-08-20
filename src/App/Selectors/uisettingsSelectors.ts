import { AppState } from "../Models/AppState"
import { UISettingsState } from "../Models/UISettingsState"
import { UIState } from "../Models/UIState"
import { pipe } from "../Utilities/pipe"

const ASA = AppState.A
const UISA = UIState.A
const UISSA = UISettingsState.A

export const getHerolistSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.herolistSortOrder)

export const getUISettingsState =
  pipe (ASA.ui, UISA.settings)

export const getHerolistVisibilityFilter =
  pipe (ASA.ui, UISA.settings, UISSA.herolistVisibilityFilter)

export const getRacesSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.racesSortOrder)

export const getCulturesSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.culturesSortOrder)

export const getCulturesVisibilityFilter =
  pipe (ASA.ui, UISA.settings, UISSA.culturesVisibilityFilter)

export const getProfessionsSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.professionsSortOrder)

export const getProfessionsVisibilityFilter =
  pipe (ASA.ui, UISA.settings, UISSA.professionsVisibilityFilter)

export const getProfessionsGroupVisibilityFilter =
  pipe (ASA.ui, UISA.settings, UISSA.professionsGroupVisibilityFilter)

export const getAdvantagesDisadvantagesCultureRatingVisibility =
  pipe (ASA.ui, UISA.settings, UISSA.advantagesDisadvantagesCultureRatingVisibility)

export const getSkillsSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.talentsSortOrder)

export const getSkillsCultureRatingVisibility =
  pipe (ASA.ui, UISA.settings, UISSA.talentsCultureRatingVisibility)

export const getCombatTechniquesSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.combatTechniquesSortOrder)

export const getSpecialAbilitiesSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.specialAbilitiesSortOrder)

export const getSpellsSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.spellsSortOrder)

export const getSpellsUnfamiliarVisibility =
  pipe (ASA.ui, UISA.settings, UISSA.spellsUnfamiliarVisibility)

export const getLiturgiesSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.liturgiesSortOrder)

export const getEquipmentSortOrder =
  pipe (ASA.ui, UISA.settings, UISSA.equipmentSortOrder)

export const getEquipmentGroupVisibilityFilter =
  pipe (ASA.ui, UISA.settings, UISSA.equipmentGroupVisibilityFilter)

export const getEnableActiveItemHints =
  pipe (ASA.ui, UISA.settings, UISSA.enableActiveItemHints)

export const getSheetCheckAttributeValueVisibility =
  pipe (ASA.ui, UISA.settings, UISSA.sheetCheckAttributeValueVisibility)

export const getSheetUseParchment =
  pipe (ASA.ui, UISA.settings, UISSA.sheetUseParchment)
export const getSheetShowRules =
  pipe (ASA.ui, UISA.settings, UISSA.sheetShowRules)

export const getSheetZoomFactor =
  pipe (ASA.ui, UISA.settings, UISSA.sheetZoomFactor)

export const getTheme =
  pipe (ASA.ui, UISA.settings, UISSA.theme)

export const getIsEditingHeroAfterCreationPhaseEnabled =
  pipe (ASA.ui, UISA.settings, UISSA.enableEditingHeroAfterCreationPhase)

export const getMeleeItemTemplateCombatTechniqueFilter =
  pipe (ASA.ui, UISA.settings, UISSA.meleeItemTemplatesCombatTechniqueFilter)

export const getRangedItemTemplateCombatTechniqueFilter =
  pipe (ASA.ui, UISA.settings, UISSA.rangedItemTemplatesCombatTechniqueFilter)

export const areAnimationsEnabled =
  pipe (ASA.ui, UISA.settings, UISSA.enableAnimations)
