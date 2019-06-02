import { bindF, ensure, Just, Maybe, maybe } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { Profession } from "../Models/Wiki/Profession";
import { CombatTechniquesSelection } from "../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { ProfessionSelections } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { ProfessionVariantSelections } from "../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
import { CombatTechniquesSecondSelection } from "../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SpecializationSelection } from "../Models/Wiki/professionSelections/SpecializationSelection";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers";
import { pipe, pipe_ } from "./pipe";

const PA = Profession.A
const PSA = ProfessionSelections.A
const PVA = ProfessionVariant.A
const PVSA = ProfessionVariantSelections.A

/**
 * Collects all available RCP adjustment selections in one record
 */
export const getAllAdjustmentSelections =
  (prof: Record<Profession>) =>
  (mprof_var: Maybe<Record<ProfessionVariant>>):
    Record<ProfessionSelections> =>
    ProfessionSelections ({
      [ProfessionSelectionIds.CANTRIPS]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.CANTRIPS])),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.CANTRIPS]))
                (Just)
        ),
      [ProfessionSelectionIds.COMBAT_TECHNIQUES]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.COMBAT_TECHNIQUES])),
          bindF (ensure (CombatTechniquesSelection.is)),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES]))
                (Just)
        ),
      [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])),
          bindF (ensure (CombatTechniquesSecondSelection.is)),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]))
                (Just)
        ),
      [ProfessionSelectionIds.CURSES]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.CURSES])),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.CURSES]))
                (Just)
        ),
      [ProfessionSelectionIds.LANGUAGES_SCRIPTS]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS])),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS]))
                (Just)
        ),
      [ProfessionSelectionIds.SKILLS]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.SKILLS])),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.SKILLS]))
                (Just)
        ),
      [ProfessionSelectionIds.SPECIALIZATION]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.SPECIALIZATION])),
          bindF (ensure (SpecializationSelection.is)),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.SPECIALIZATION]))
                (Just)
        ),
      [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]:
        pipe_ (
          mprof_var,
          bindF (pipe (PVA.selections, PVSA[ProfessionSelectionIds.TERRAIN_KNOWLEDGE])),
          maybe (pipe_ (prof, PA.selections, PSA[ProfessionSelectionIds.TERRAIN_KNOWLEDGE]))
                (Just)
        ),
    })
