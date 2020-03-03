export interface RawConfig {
  herolistSortOrder: "name" | "dateModified"
  herolistVisibilityFilter: "all" | "own" | "shared"
  racesSortOrder: "name" | "cost"
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
  enableActiveItemHints: boolean
  locale?: string
  theme?: "light" | "dark"
  enableEditingHeroAfterCreationPhase?: boolean
  meleeItemTemplatesCombatTechniqueFilter?: string
  rangedItemTemplatesCombatTechniqueFilter?: string
  enableAnimations?: boolean
}
