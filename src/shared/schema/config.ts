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
  theme?: Theme
  enableEditingHeroAfterCreationPhase?: boolean
  meleeItemTemplatesCombatTechniqueFilter?: string
  rangedItemTemplatesCombatTechniqueFilter?: string
  enableAnimations?: boolean
}

export enum CharactersSortOrder {
  Name = "name",
  DateModified = "datemodified",
  DateCreated = "datecreated",
}

export enum RacesSortOrder {
  Name = "name",
  Cost = "cost",
}

export enum CulturesSortOrder {
  Name = "name",
  Cost = "cost",
}

export enum CulturesVisibilityFilter {
  All = "all",
  Common = "common",
}

export enum ProfessionsSortOrder {
  Name = "name",
  Cost = "cost",
}

export enum ProfessionsVisibilityFilter {
  All = "all",
  Common = "common",
}

export enum ProfessionsGroupVisibilityFilter {
  All = 0,
  Mundane = 1,
  Magical = 2,
  Blessed = 3,
}

export enum SkillsSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

export enum CombatTechniquesSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

export enum SpecialAbilitiesSortOrder {
  Name = "name",
  Group = "group",
  GroupName = "groupname",
}

export enum SpellsSortOrder {
  Name = "name",
  Group = "group",
  Property = "property",
  ImprovementCost = "ic",
}

export enum LiturgiesSortOrder {
  Name = "name",
  Group = "group",
  ImprovementCost = "ic",
}

export enum EquipmentSortOrder {
  Name = "name",
  GroupName = "groupname",
  Where = "where",
  Weight = "weight",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}
