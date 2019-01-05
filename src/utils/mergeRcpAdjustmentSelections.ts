import { pipe } from "ramda";
import { Profession } from "../App/Models/Wiki/Profession";
import { isCantripsSelection } from "../App/Models/Wiki/professionSelections/CantripsSelection";
import { isCombatTechniquesSelection } from "../App/Models/Wiki/professionSelections/CombatTechniquesSelection";
import { isCursesSelection } from "../App/Models/Wiki/professionSelections/CursesSelection";
import { isLanguagesScriptsSelection } from "../App/Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections, ProfessionSelectionsL } from "../App/Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { isRemoveCombatTechniquesSelection } from "../App/Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveCombatTechniquesSecondSelection } from "../App/Models/Wiki/professionSelections/RemoveSecondCombatTechniquesSelection";
import { isRemoveSpecializationSelection } from "../App/Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { isSecondCombatTechniquesSelection } from "../App/Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { isSkillsSelection } from "../App/Models/Wiki/professionSelections/SkillsSelection";
import { isSpecializationSelection } from "../App/Models/Wiki/professionSelections/SpecializationSelection";
import { ProfessionVariant } from "../App/Models/Wiki/ProfessionVariant";
import { AnyProfessionSelection, AnyProfessionVariantSelection, ProfessionSelectionIds } from "../App/Models/Wiki/wikiTypeHelpers";
import { flip, ident } from "../Data/Function";
import { set } from "../Data/Lens";
import { foldl } from "../Data/List";
import { Just, Maybe, maybe, Nothing } from "../Data/Maybe";
import { Record } from "../Data/Record";

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
