import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"
import { CantripsSelection } from "./CantripsSelection"
import { CombatTechniquesSelection } from "./CombatTechniquesSelection"
import { CursesSelection } from "./CursesSelection"
import { LanguagesScriptsSelection } from "./LanguagesScriptsSelection"
import { SkillsSelection } from "./SkillsSelection"
import { SpecializationSelection } from "./SpecializationSelection"
import { TerrainKnowledgeSelection } from "./TerrainKnowledgeSelection"

export interface ProfessionSelections {
  "@@name": "ProfessionSelections"
  [ProfessionSelectionIds.CANTRIPS]: Maybe<Record<CantripsSelection>>
  [ProfessionSelectionIds.COMBAT_TECHNIQUES]: Maybe<Record<CombatTechniquesSelection>>
  [ProfessionSelectionIds.CURSES]: Maybe<Record<CursesSelection>>
  [ProfessionSelectionIds.LANGUAGES_SCRIPTS]: Maybe<Record<LanguagesScriptsSelection>>
  [ProfessionSelectionIds.SPECIALIZATION]: Maybe<Record<SpecializationSelection>>
  [ProfessionSelectionIds.SKILLS]: Maybe<Record<SkillsSelection>>
  [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]: Maybe<Record<TerrainKnowledgeSelection>>
  [ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]: boolean

  // [ProfessionSelectionIds.SPECIAL_ABILITY]: Maybe<Record<SpecialAbilitySelection>>
}

export const ProfessionSelections =
  fromDefault ("ProfessionSelections")
              <ProfessionSelections> ({
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

export const ProfessionSelectionsL = makeLenses (ProfessionSelections)
