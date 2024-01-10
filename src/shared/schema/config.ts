/**
 * Types for the user-configurable app-wide settings.
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

/**
 * Possible sort orders for characters.
 */
export type CharactersSortOrder = "name" | "datemodified" | "datecreated"

/**
 * Possible sort orders for races.
 */
export type RacesSortOrder = "name" | "cost"

/**
 * Possible sort orders for cultures.
 */
export type CulturesSortOrder = "name" | "cost"

/**
 * Possible filters for cultures.
 */
export type CulturesVisibilityFilter = "all" | "common"

/**
 * Possible sort orders for professions.
 */
export type ProfessionsSortOrder = "name" | "cost"

/**
 * Possible filters for professions.
 */
export type ProfessionsVisibilityFilter = "all" | "common"

/**
 * Possible filters for profession groups.
 */
export type ProfessionsGroupVisibilityFilter = 0 | 1 | 2 | 3

/**
 * Possible sort orders for skills.
 */
export type SkillsSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for combat techniques.
 */
export type CombatTechniquesSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for special abilities.
 */
export type SpecialAbilitiesSortOrder = "name" | "group" | "groupname"

/**
 * Possible sort orders for spells.
 */
export type SpellsSortOrder = "name" | "group" | "property" | "ic"

/**
 * Possible sort orders for liturgies.
 */
export type LiturgiesSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for equipment.
 */
export type EquipmentSortOrder = "name" | "groupname" | "where" | "weight"
