import { Maybe } from "../../Data/Maybe"
import { EquipmentGroup } from "../Constants/Groups"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids"
import { ChantsSortOptions, CombatTechniquesSortOptions, CulturesSortOptions, CulturesVisibilityFilter, EquipmentSortOptions, HeroListSortOptions, HeroListVisibilityFilter, ProfessionsGroupVisibilityFilter, ProfessionsSortOptions, ProfessionsVisibilityFilter, RacesSortOptions, SkillsSortOptions, SpecialAbilitiesSortOptions, SpellsSortOptions, Theme } from "./Config"

export interface UISettingsState {
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
  theme: Theme
  enableEditingHeroAfterCreationPhase: boolean
  meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  enableAnimations: boolean
}
