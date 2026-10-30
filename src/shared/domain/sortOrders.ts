/**
 * Possible sort orders for displayed characters.
 */
export type CharactersSortOrder = "name" | "datemodified" | "datecreated"

/**
 * Possible sort orders for displayed characters.
 */
export const CharactersSortOrder = Object.freeze({
  Name: "name",
  DateModified: "datemodified",
  DateCreated: "datecreated",
})

/**
 * Possible sort orders for displayed races.
 */
export type RacesSortOrder = "name" | "cost"

/**
 * Possible sort orders for displayed races.
 */
export const RacesSortOrder = Object.freeze({
  Name: "name",
  Cost: "cost",
})

/**
 * Possible sort orders for displayed cultures.
 */
export type CulturesSortOrder = "name" | "cost"

/**
 * Possible sort orders for displayed cultures.
 */
export const CulturesSortOrder = Object.freeze({
  Name: "name",
  Cost: "cost",
})

/**
 * Possible filter options by recommendation for cultures.
 */
export type CulturesVisibilityFilter = "all" | "common"

/**
 * Possible filter options by recommendation for cultures.
 */
export const CulturesVisibilityFilter = Object.freeze({
  All: "all",
  Common: "common",
})

/**
 * Possible sort orders for displayed professions.
 */
export type ProfessionsSortOrder = "name" | "cost"

/**
 * Possible sort orders for displayed professions.
 */
export const ProfessionsSortOrder = Object.freeze({
  Name: "name",
  Cost: "cost",
})

/**
 * Possible filter options by recommendation for professions
 */
export type ProfessionsVisibilityFilter = "all" | "common"

/**
 * Possible filter options by recommendation for professions
 */
export const ProfessionsVisibilityFilter = Object.freeze({
  All: "all",
  Common: "common",
})

/**
 * Possible filter options by group for professions.
 */
export type ProfessionsGroupVisibilityFilter = 0 | 1 | 2 | 3

/**
 * Possible filter options by group for professions.
 */
export const ProfessionsGroupVisibilityFilter = Object.freeze({
  All: 0,
  Mundane: 1,
  Magical: 2,
  Blessed: 3,
})

/**
 * Possible sort orders for displayed skills.
 */
export type SkillsSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for displayed skills.
 */
export const SkillsSortOrder = Object.freeze({
  Name: "name",
  Group: "group",
  ImprovementCost: "ic",
})

/**
 * Possible sort orders for displayed combat techniques.
 */
export type CombatTechniquesSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for displayed combat techniques.
 */
export const CombatTechniquesSortOrder = Object.freeze({
  Name: "name",
  Group: "group",
  ImprovementCost: "ic",
})

/**
 * Possible sort orders for displayed spells.
 */
export type SpellsSortOrder = "name" | "group" | "property" | "ic"

/**
 * Possible sort orders for displayed spells.
 */
export const SpellsSortOrder = Object.freeze({
  Name: "name",
  Group: "group",
  Property: "property",
  ImprovementCost: "ic",
})

/**
 * Possible sort orders for displayed liturgical chants.
 */
export type LiturgiesSortOrder = "name" | "group" | "ic"

/**
 * Possible sort orders for displayed liturgical chants.
 */
export const LiturgiesSortOrder = Object.freeze({
  Name: "name",
  Group: "group",
  ImprovementCost: "ic",
})

/**
 * Possible sort orders for displayed special abilities.
 */
export type SpecialAbilitiesSortOrder = "name" | "group"

/**
 * Possible sort orders for displayed special abilities.
 */
export const SpecialAbilitiesSortOrder = Object.freeze({
  Name: "name",
  Group: "group",
})

/**
 * Possible sort orders for displayed equipment.
 */
export type EquipmentSortOrder = "name" | "groupname" | "where" | "weight"

/**
 * Possible sort orders for displayed equipment.
 */
export const EquipmentSortOrder = Object.freeze({
  Name: "name",
  GroupName: "groupname",
  Where: "where",
  Weight: "weight",
})
