import { List } from "../../../../Data/List"
import { Just, Maybe, maybeToUndefined, Nothing } from "../../../../Data/Maybe"
import { fromDefault, Record, toObject } from "../../../../Data/Record"
import { fromJSBool, fromJSBoolM, fromJSEnum, fromJSEnumM, fromJSInArray, tryParseJSONRecord } from "../../../../Data/String/JSON"
import { EquipmentGroup } from "../../../Constants/Groups"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../../../Constants/Ids"
import { SortNames } from "../../../Views/Universal/SortOptions"
import { pipe } from "../../pipe"
import { RawConfig } from "../RawData"

export type HeroListSortOptions = SortNames.Name
                                | SortNames.DateModified

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

export const RacesSortOptions = List<RacesSortOptions> (
  SortNames.Name,
  SortNames.Cost,
)

export type CulturesSortOptions = SortNames.Name
                                | SortNames.Cost

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

export const SkillsSortOptions = List<SkillsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type SpecialAbilitiesSortOptions = SortNames.Name
                                        | SortNames.GroupName

export const SpecialAbilitiesSortOptions = List<SpecialAbilitiesSortOptions> (
  SortNames.Name,
  SortNames.GroupName,
)

export type CombatTechniquesSortOptions = SortNames.Name
                                        | SortNames.Group
                                        | SortNames.IC

export const CombatTechniquesSortOptions = List<CombatTechniquesSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type SpellsSortOptions = SortNames.Name
                              | SortNames.Group
                              | SortNames.Property
                              | SortNames.IC

export const SpellsSortOptions = List<SpellsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.Property,
  SortNames.IC,
)

export type ChantsSortOptions = SortNames.Name
                              | SortNames.Group
                              | SortNames.IC

export const ChantsSortOptions = List<ChantsSortOptions> (
  SortNames.Name,
  SortNames.Group,
  SortNames.IC,
)

export type EquipmentSortOptions = SortNames.Name
                                 | SortNames.GroupName
                                 | SortNames.Where
                                 | SortNames.Weight

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
  enableActiveItemHints: boolean
  locale: Maybe<Locale>
  theme: Maybe<Theme>
  enableEditingHeroAfterCreationPhase: Maybe<boolean>
  meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  enableAnimations: Maybe<boolean>
}

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
                enableActiveItemHints: false,
                locale: Nothing,
                theme: Just (Theme.Dark),
                enableEditingHeroAfterCreationPhase: Just (false),
                meleeItemTemplatesCombatTechniqueFilter: Nothing,
                rangedItemTemplatesCombatTechniqueFilter: Nothing,
                enableAnimations: Just (false),
              })

export const readConfig =
  tryParseJSONRecord <Config> ({
                                herolistSortOrder: fromJSInArray (HeroListSortOptions)
                                                                 ("HeroListSortOptions"),
                                herolistVisibilityFilter: fromJSEnum ("HeroListVisibilityFilter")
                                                                     (HeroListVisibilityFilter),
                                racesSortOrder: fromJSInArray (RacesSortOptions)
                                                              ("RacesSortOptions"),
                                culturesSortOrder: fromJSInArray (CulturesSortOptions)
                                                                 ("CulturesSortOptions"),
                                culturesVisibilityFilter: fromJSEnum ("CulturesVisibilityFilter")
                                                                     (CulturesVisibilityFilter),
                                professionsSortOrder: fromJSInArray (ProfessionsSortOptions)
                                                                    ("ProfessionsSortOptions"),
                                professionsVisibilityFilter:
                                  fromJSEnum ("ProfessionsVisibilityFilter")
                                             (ProfessionsVisibilityFilter),
                                professionsGroupVisibilityFilter:
                                  fromJSEnum ("ProfessionsGroupVisibilityFilter")
                                             (ProfessionsGroupVisibilityFilter),
                                advantagesDisadvantagesCultureRatingVisibility: fromJSBool,
                                talentsSortOrder: fromJSInArray (SkillsSortOptions)
                                                                ("SkillsSortOptions"),
                                talentsCultureRatingVisibility: fromJSBool,
                                combatTechniquesSortOrder:
                                  fromJSInArray (CombatTechniquesSortOptions)
                                                ("CombatTechniquesSortOptions"),
                                specialAbilitiesSortOrder:
                                  pipe (
                                    x => x === "group" ? SortNames.GroupName : x,
                                    fromJSInArray (SpecialAbilitiesSortOptions)
                                                  ("SpecialAbilitiesSortOptions")
                                  ),
                                spellsSortOrder: fromJSInArray (SpellsSortOptions)
                                                               ("SpellsSortOptions"),
                                spellsUnfamiliarVisibility: fromJSBool,
                                liturgiesSortOrder: fromJSInArray (ChantsSortOptions)
                                                                  ("ChantsSortOptions"),
                                equipmentSortOrder: fromJSInArray (EquipmentSortOptions)
                                                                  ("EquipmentSortOptions"),
                                equipmentGroupVisibilityFilter: fromJSEnum ("EquipmentGroup")
                                                                           (EquipmentGroup),
                                sheetCheckAttributeValueVisibility: fromJSBoolM,
                                enableActiveItemHints: fromJSBool,
                                locale: fromJSEnumM ("Locale") (Locale),
                                theme: fromJSEnumM ("Theme") (Theme),
                                enableEditingHeroAfterCreationPhase: fromJSBoolM,
                                meleeItemTemplatesCombatTechniqueFilter:
                                  fromJSEnumM ("MeleeCombatTechniqueId")
                                              (MeleeCombatTechniqueId),
                                rangedItemTemplatesCombatTechniqueFilter:
                                  fromJSEnumM ("RangedCombatTechniqueId")
                                              (RangedCombatTechniqueId),
                                enableAnimations: fromJSBoolM,
                              })
                              (Config)
                              ("Config")

export const writeConfig = (x: Record<Config>): string => {
  const obj = toObject (x)

  const serialized_obj: RawConfig = {
    ...obj,
    sheetCheckAttributeValueVisibility: maybeToUndefined (obj.sheetCheckAttributeValueVisibility),
    locale: maybeToUndefined (obj.locale),
    theme: maybeToUndefined (obj.theme),
    enableEditingHeroAfterCreationPhase: maybeToUndefined (obj.enableEditingHeroAfterCreationPhase),
    enableAnimations: maybeToUndefined (obj.enableAnimations),
    meleeItemTemplatesCombatTechniqueFilter:
      maybeToUndefined (obj.meleeItemTemplatesCombatTechniqueFilter as Maybe<string>),
    rangedItemTemplatesCombatTechniqueFilter:
      maybeToUndefined (obj.rangedItemTemplatesCombatTechniqueFilter as Maybe<string>),
  }

  return JSON.stringify (serialized_obj)
}
