/**
 * @main Config
 */

/**
 * The user-configurable app-wide settings.
 */
export type Config = {
  locale?: string
  fallbackLocale?: string
  herolistSortOrder: CharactersSortOrder
  herolistVisibilityFilter: "all" | "own" | "shared"
  racesSortOrder: RacesSortOrder
  racesValueVisibility?: boolean
  culturesSortOrder: CulturesSortOrder
  culturesVisibilityFilter: CulturesVisibilityFilter
  culturesValueVisibility?: boolean
  professionsSortOrder: ProfessionsSortOrder
  professionsVisibilityFilter: ProfessionsVisibilityFilter
  professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter
  professionsFromExpansionsVisibility?: boolean
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: SkillsSortOrder
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: CombatTechniquesSortOrder
  specialAbilitiesSortOrder: SpecialAbilitiesSortOrder
  spellsSortOrder: SpellsSortOrder
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: LiturgiesSortOrder
  equipmentSortOrder: EquipmentSortOrder
  equipmentGroupVisibilityFilter: number
  sheetCheckAttributeValueVisibility?: boolean
  sheetUseParchment?: boolean
  sheetZoomFactor?: number
  enableActiveItemHints: boolean
  theme?: "light" | "dark"
  enableEditingHeroAfterCreationPhase?: boolean
  meleeItemTemplatesCombatTechniqueFilter?: string
  rangedItemTemplatesCombatTechniqueFilter?: string
  enableAnimations?: boolean
}

export type CharactersSortOrder = "name" | "datemodified" | "datecreated"

export type RacesSortOrder = "name" | "cost"

export type CulturesSortOrder = "name" | "cost"

export type CulturesVisibilityFilter = "all" | "common"

export type ProfessionsSortOrder = "name" | "cost"

export type ProfessionsVisibilityFilter = "all" | "common"

export type ProfessionsGroupVisibilityFilter = 0 | 1 | 2 | 3

export type SkillsSortOrder = "name" | "group" | "ic"

export type CombatTechniquesSortOrder = "name" | "group" | "ic"

export type SpecialAbilitiesSortOrder = "name" | "group" | "groupname"

export type SpellsSortOrder = "name" | "group" | "property" | "ic"

export type LiturgiesSortOrder = "name" | "group" | "ic"

export type EquipmentSortOrder = "name" | "groupname" | "where" | "weight"
