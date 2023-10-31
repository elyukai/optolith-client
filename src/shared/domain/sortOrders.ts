/**
 * Possible sort orders for displayed characters.
 */
export enum CharactersSortOrder {
  Name = "name",
  DateModified = "datemodified",
  DateCreated = "datecreated",
}

/**
 * Possible sort orders for displayed races.
 */
export enum RacesSortOrder {
  Name = "name",
  Cost = "cost",
}

/**
 * Possible sort orders for displayed cultures.
 */
export enum CulturesSortOrder {
  Name = "name",
  Cost = "cost",
}

/**
 * Possible filter options by recommendation for cultures.
 */
export enum CulturesVisibilityFilter {
  All = "all",
  Common = "common",
}

/**
 * Possible sort orders for displayed professions.
 */
export enum ProfessionsSortOrder {
  Name = "name",
  Cost = "cost",
}

/**
 * Possible filter options by recommendation for professions
 */
export enum ProfessionsVisibilityFilter {
  All = "all",
  Common = "common",
}

/**
 * Possible filter options by group for professions.
 */
export enum ProfessionsGroupVisibilityFilter {
  All = 0,
  Mundane = 1,
  Magical = 2,
  Blessed = 3,
}

/**
 * Possible sort orders for displayed skills.
 */
export enum SkillsSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

/**
 * Possible sort orders for displayed combat techniques.
 */
export enum CombatTechniquesSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

/**
 * Possible sort orders for displayed spells.
 */
export enum SpellsSortOrder {
  Name = "name",
  Group = "group",
  Property = "property",
  ImprovementCost = "ic",
}

/**
 * Possible sort orders for displayed liturgical chants.
 */
export enum LiturgiesSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

/**
 * Possible sort orders for displayed special abilities.
 */
export enum SpecialAbilitiesSortOrder {
  Name = "name",
  Group = "group",
}

/**
 * Possible sort orders for displayed equipment.
 */
export enum EquipmentSortOrder {
  Name = "name",
  GroupName = "groupname",
  Where = "where",
  Weight = "weight",
}
