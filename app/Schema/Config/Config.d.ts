export interface RawConfig {
  herolistSortOrder: "name" | "datemodified" | "dateModified"
  herolistVisibilityFilter: "all" | "own" | "shared"
  racesSortOrder: "name" | "cost"
  racesValueVisibility?: boolean
  culturesSortOrder: "name" | "cost"
  culturesVisibilityFilter: "all" | "common"
  culturesValueVisibility?: boolean
  professionsSortOrder: "name" | "cost"
  professionsVisibilityFilter: "all" | "common"
  professionsGroupVisibilityFilter: 0 | 1 | 2 | 3
  professionsFromExpansionsVisibility?: boolean
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: "name" | "group" | "ic"
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: "name" | "group" | "ic"
  specialAbilitiesSortOrder: "name" | "group" | "groupname"
  spellsSortOrder: "name" | "group" | "property" | "ic"
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: "name" | "group" | "ic"
  equipmentSortOrder: "name" | "groupname" | "where" | "weight"
  equipmentGroupVisibilityFilter: number
  sheetCheckAttributeValueVisibility?: boolean
  sheetUseParchment?: boolean
  sheetShowRules?: boolean
  sheetZoomFactor?: number
  enableActiveItemHints: boolean
  locale?: string
  fallbackLocale?: string
  theme?: "light" | "dark"
  enableEditingHeroAfterCreationPhase?: boolean
  meleeItemTemplatesCombatTechniqueFilter?: string
  rangedItemTemplatesCombatTechniqueFilter?: string
  enableAnimations?: boolean
}
