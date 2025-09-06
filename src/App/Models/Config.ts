import { List } from "../../Data/List"
import { Just, Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault } from "../../Data/Record"
import { EquipmentGroup } from "../Constants/Groups"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids"
import { SortNames } from "../Views/Universal/SortOptions"

export type HeroListSortOptions = SortNames.Name
                                | SortNames.DateModified

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HeroListSortOptions = List<HeroListSortOptions> (
  SortNames.Name,
  SortNames.DateModified,
)

export enum HeroListVisibilityFilter {
  All = "all",
  Own = "own",
  Shared = "shared",
}

export type RacesSortOptions = SortNames.Name
                             | SortNames.Cost

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RacesSortOptions = List<RacesSortOptions> (
  SortNames.Name,
  SortNames.Cost,
)

export type CulturesSortOptions = SortNames.Name
                                | SortNames.Cost

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CulturesSortOptions = List<CulturesSortOptions> (
  SortNames.Name,
  SortNames.Cost,
)

export enum CulturesVisibilityFilter {
  All = "all",
  Common = "common",
}

export type ProfessionsSortOptions = SortNames.Name
                                   | SortNames.Cost

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ProfessionsSortOptions = List<ProfessionsSortOptions> (
  SortNames.Name,
  SortNames.Cost,
)

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

export type SkillsSortOptions = SortNames.Name
                              | SortNames.Group
                              | SortNames.IC

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillsSortOptions = List<SkillsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type SpecialAbilitiesSortOptions = SortNames.Name
                                        | SortNames.GroupName

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SpecialAbilitiesSortOptions = List<SpecialAbilitiesSortOptions> (
  SortNames.Name,
  SortNames.GroupName,
)

export type CombatTechniquesSortOptions = SortNames.Name
                                        | SortNames.Group
                                        | SortNames.IC

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CombatTechniquesSortOptions = List<CombatTechniquesSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type SpellsSortOptions = SortNames.Name
                              | SortNames.Group
                              | SortNames.Property
                              | SortNames.IC

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SpellsSortOptions = List<SpellsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.Property,
  SortNames.IC,
)

export type ChantsSortOptions = SortNames.Name
                              | SortNames.Group
                              | SortNames.IC

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ChantsSortOptions = List<ChantsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type EquipmentSortOptions = SortNames.Name
                                 | SortNames.GroupName
                                 | SortNames.Where
                                 | SortNames.Weight

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EquipmentSortOptions = List<EquipmentSortOptions> (
  SortNames.Name,
  SortNames.GroupName,
  SortNames.Where,
  SortNames.Weight,
)

export enum Locale {
  German = "de-DE",
  English = "en-US",
  French = "fr-FR",
  Dutch = "nl-BE",
  Italian = "it-IT",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface Config {
  "@@name": "Config"
  herolistSortOrder: HeroListSortOptions
  herolistVisibilityFilter: HeroListVisibilityFilter
  racesSortOrder: RacesSortOptions
  culturesSortOrder: CulturesSortOptions
  culturesVisibilityFilter: CulturesVisibilityFilter
  professionsSortOrder: ProfessionsSortOptions
  professionsVisibilityFilter: ProfessionsVisibilityFilter
  professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: SkillsSortOptions
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: CombatTechniquesSortOptions
  specialAbilitiesSortOrder: SpecialAbilitiesSortOptions
  spellsSortOrder: SpellsSortOptions
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: ChantsSortOptions
  equipmentSortOrder: EquipmentSortOptions
  equipmentGroupVisibilityFilter: EquipmentGroup
  sheetCheckAttributeValueVisibility: Maybe<boolean>
  sheetUseParchment: Maybe<boolean>
  sheetShowRules: Maybe<boolean>
  sheetZoomFactor: number
  enableActiveItemHints: boolean
  locale: Maybe<string>
  fallbackLocale: Maybe<string>
  theme: Maybe<Theme>
  enableEditingHeroAfterCreationPhase: Maybe<boolean>
  meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  enableAnimations: Maybe<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Config =
  fromDefault ("Config")
              <Config> ({
                herolistSortOrder: SortNames.Name,
                herolistVisibilityFilter: HeroListVisibilityFilter.All,
                racesSortOrder: SortNames.Name,
                culturesSortOrder: SortNames.Name,
                culturesVisibilityFilter: CulturesVisibilityFilter.Common,
                professionsSortOrder: SortNames.Name,
                professionsVisibilityFilter: ProfessionsVisibilityFilter.Common,
                professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter.All,
                advantagesDisadvantagesCultureRatingVisibility: false,
                talentsSortOrder: SortNames.Group,
                talentsCultureRatingVisibility: false,
                combatTechniquesSortOrder: SortNames.Name,
                specialAbilitiesSortOrder: SortNames.Name,
                spellsSortOrder: SortNames.Name,
                spellsUnfamiliarVisibility: false,
                liturgiesSortOrder: SortNames.Name,
                equipmentSortOrder: SortNames.Name,
                equipmentGroupVisibilityFilter: EquipmentGroup.MeleeWeapons,
                sheetCheckAttributeValueVisibility: Just (false),
                sheetUseParchment: Just (false),
                sheetShowRules: Just (false),
                sheetZoomFactor: 100,
                enableActiveItemHints: false,
                locale: Nothing,
                fallbackLocale: Nothing,
                theme: Just (Theme.Dark),
                enableEditingHeroAfterCreationPhase: Just (false),
                meleeItemTemplatesCombatTechniqueFilter: Nothing,
                rangedItemTemplatesCombatTechniqueFilter: Nothing,
                enableAnimations: Just (false),
              })
