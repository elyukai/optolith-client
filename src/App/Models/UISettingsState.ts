import { Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault, makeLenses } from "../../Data/Record"
import { EquipmentGroup } from "../Constants/Groups"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids"
import { SortNames } from "../Views/Universal/SortOptions"
import { ChantsSortOptions, CombatTechniquesSortOptions, CulturesSortOptions, CulturesVisibilityFilter, EquipmentSortOptions, HeroListSortOptions, HeroListVisibilityFilter, ProfessionsGroupVisibilityFilter, ProfessionsSortOptions, ProfessionsVisibilityFilter, RacesSortOptions, SkillsSortOptions, SpecialAbilitiesSortOptions, SpellsSortOptions, Theme } from "./Config"

export interface UISettingsState {
  "@@name": "UISettingsState"
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
  enableActiveItemHints: boolean
  sheetCheckAttributeValueVisibility: boolean
  sheetUseParchment: boolean
  sheetShowRules: boolean
  sheetZoomFactor: number
  theme: Theme
  enableEditingHeroAfterCreationPhase: boolean
  meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  enableAnimations: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UISettingsState =
  fromDefault ("UISettingsState")
              <UISettingsState> ({
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
                specialAbilitiesSortOrder: SortNames.GroupName,
                spellsSortOrder: SortNames.Name,
                spellsUnfamiliarVisibility: false,
                liturgiesSortOrder: SortNames.Name,
                equipmentSortOrder: SortNames.Name,
                equipmentGroupVisibilityFilter: EquipmentGroup.MeleeWeapons,
                enableActiveItemHints: false,
                sheetCheckAttributeValueVisibility: false,
                sheetUseParchment: false,
                sheetShowRules: false,
                sheetZoomFactor: 100,
                theme: Theme.Dark,
                enableEditingHeroAfterCreationPhase: false,
                meleeItemTemplatesCombatTechniqueFilter: Nothing,
                rangedItemTemplatesCombatTechniqueFilter: Nothing,
                enableAnimations: true,
              })

export const UISettingsStateL = makeLenses (UISettingsState)
