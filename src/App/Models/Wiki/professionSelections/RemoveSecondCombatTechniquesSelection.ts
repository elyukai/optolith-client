import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionVariantSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";
import { CombatTechniquesSecondSelection } from "./SecondCombatTechniquesSelection";

export interface RemoveCombatTechniquesSecondSelection {
  "@@name": "RemoveCombatTechniquesSecondSelection"
  id: ProfessionSelectionIds
  active: false
}

export type VariantCombatTechniquesSecondSelection =
  Record<CombatTechniquesSecondSelection> |
  Record<RemoveCombatTechniquesSecondSelection>

const _RemoveCombatTechniquesSecondSelection =
  fromDefault ("RemoveCombatTechniquesSecondSelection")
              <RemoveCombatTechniquesSecondSelection> ({
                id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
                active: false,
              })

export const RemoveCombatTechniquesSecondSelection =
  _RemoveCombatTechniquesSecondSelection ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const isRemoveCombatTechniquesSecondSelection =
  (obj: AnyProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSecondSelection> =>
    obj === RemoveCombatTechniquesSecondSelection
