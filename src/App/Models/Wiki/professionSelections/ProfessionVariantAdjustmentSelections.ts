import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"
import { CantripsSelection } from "./CantripsSelection"
import { CursesSelection } from "./CursesSelection"
import { LanguagesScriptsSelection } from "./LanguagesScriptsSelection"
import { VariantCombatTechniquesSelection } from "./RemoveCombatTechniquesSelection"
import { VariantSpecializationSelection } from "./RemoveSpecializationSelection"
import { SkillsSelection } from "./SkillsSelection"
import { TerrainKnowledgeSelection } from "./TerrainKnowledgeSelection"

export interface ProfessionVariantSelections {
  "@@name": "ProfessionVariantSelections"
  [ProfessionSelectionIds.CANTRIPS]: Maybe<Record<CantripsSelection>>
  [ProfessionSelectionIds.COMBAT_TECHNIQUES]: Maybe<VariantCombatTechniquesSelection>
  [ProfessionSelectionIds.CURSES]: Maybe<Record<CursesSelection>>
  [ProfessionSelectionIds.LANGUAGES_SCRIPTS]: Maybe<Record<LanguagesScriptsSelection>>
  [ProfessionSelectionIds.SPECIALIZATION]: Maybe<VariantSpecializationSelection>
  [ProfessionSelectionIds.SKILLS]: Maybe<Record<SkillsSelection>>
  [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]: Maybe<Record<TerrainKnowledgeSelection>>
  [ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]: boolean

  // [ProfessionSelectionIds.SPECIAL_ABILITY]: Maybe<Record<SpecialAbilitySelection>>
}

export const ProfessionVariantSelections =
  fromDefault ("ProfessionVariantSelections")
              <ProfessionVariantSelections> ({
                [ProfessionSelectionIds.CANTRIPS]: Nothing,
                [ProfessionSelectionIds.COMBAT_TECHNIQUES]: Nothing,
                [ProfessionSelectionIds.CURSES]: Nothing,
                [ProfessionSelectionIds.LANGUAGES_SCRIPTS]: Nothing,
                [ProfessionSelectionIds.SPECIALIZATION]: Nothing,
                [ProfessionSelectionIds.SKILLS]: Nothing,
                [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]: Nothing,
                [ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]: false,

                // [ProfessionSelectionIds.SPECIAL_ABILITY]: Nothing,
              })

export const ProfessionVariantSelectionsL = makeLenses (ProfessionVariantSelections)
