import { pipe } from "ramda";
import { flip, ident } from "./structures/Function";
import { set } from "./structures/Lens";
import { foldl } from "./structures/List";
import { Just, Maybe, maybe, Nothing } from "./structures/Maybe";
import { Record } from "./structures/Record";
import { Profession } from "./wikiData/Profession";
import { isCantripsSelection } from "./wikiData/professionSelections/CantripsSelection";
import { isCombatTechniquesSelection } from "./wikiData/professionSelections/CombatTechniquesSelection";
import { isCursesSelection } from "./wikiData/professionSelections/CursesSelection";
import { isLanguagesScriptsSelection } from "./wikiData/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections, ProfessionSelectionsL } from "./wikiData/professionSelections/ProfessionAdjustmentSelections";
import { isRemoveCombatTechniquesSelection } from "./wikiData/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveCombatTechniquesSecondSelection } from "./wikiData/professionSelections/RemoveSecondCombatTechniquesSelection";
import { isRemoveSpecializationSelection } from "./wikiData/professionSelections/RemoveSpecializationSelection";
import { isSecondCombatTechniquesSelection } from "./wikiData/professionSelections/SecondCombatTechniquesSelection";
import { isSkillsSelection } from "./wikiData/professionSelections/SkillsSelection";
import { isSpecializationSelection } from "./wikiData/professionSelections/SpecializationSelection";
import { ProfessionVariant } from "./wikiData/ProfessionVariant";
import { AnyProfessionSelection, AnyProfessionVariantSelection, ProfessionSelectionIds } from "./wikiData/wikiTypeHelpers";

/**
 * Collects all available RCP adjustment selections in one record
 */
export const getAllAdjustmentSelections =
  (profession: Record<Profession>) =>
  (maybeProfessionVariant: Maybe<Record<ProfessionVariant>>): Record<ProfessionSelections> => {
    const buildRecord = pipe (
      putProfessionSelectionsIntoRecord,
      putProfessionVariantSelectionsIntoRecord (maybeProfessionVariant)
    )

    return buildRecord (profession)
  }

const putProfessionSelectionIntoRecord =
  (acc: Record<ProfessionSelections>) => (current: AnyProfessionSelection) => {
    if (isSpecializationSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.SPECIALIZATION])
                 (Just (current))
                 (acc)
    }

    if (isLanguagesScriptsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.LANGUAGES_SCRIPTS])
                 (Just (current))
                 (acc)
    }

    if (isCombatTechniquesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
                 (Just (current))
                 (acc)
    }

    if (isSecondCombatTechniquesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                 (Just (current))
                 (acc)
    }

    if (isCantripsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.CANTRIPS])
                 (Just (current))
                 (acc)
    }

    if (isCursesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.CURSES])
                 (Just (current))
                 (acc)
    }

    if (isSkillsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.SKILLS])
                 (Just (current))
                 (acc)
    }

    return set (ProfessionSelectionsL[ProfessionSelectionIds.TERRAIN_KNOWLEDGE])
               (Just (current))
               (acc)
  }

const putProfessionVariantSelectionIntoRecord =
  (acc: Record<ProfessionSelections>) => (current: AnyProfessionVariantSelection) => {
    if (isRemoveSpecializationSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.SPECIALIZATION])
                 (Nothing)
                 (acc)
    }

    if (isRemoveCombatTechniquesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
                 (Nothing)
                 (acc)
    }

    if (isRemoveCombatTechniquesSecondSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                 (Nothing)
                 (acc)
    }

    return putProfessionSelectionIntoRecord (acc) (current)
  }

const putProfessionSelectionsIntoRecord =
  pipe (
    Profession.A.selections,
    foldl<AnyProfessionSelection, Record<ProfessionSelections>> (putProfessionSelectionIntoRecord)
                                                              (ProfessionSelections ({ }))
  )

const putProfessionVariantSelectionsIntoRecord =
  maybe<
    Record<ProfessionVariant>,
    (x: Record<ProfessionSelections>) => Record<ProfessionSelections>
  >
    (ident)
    (pipe (
      ProfessionVariant.A.selections,
      flip (
        foldl<AnyProfessionVariantSelection, Record<ProfessionSelections>>
          (putProfessionVariantSelectionIntoRecord)
      )
    ))
