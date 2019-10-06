import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionVariantSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";
import { CombatTechniquesSelection } from "./CombatTechniquesSelection";

export interface RemoveCombatTechniquesSelection {
  "@@name": "RemoveCombatTechniquesSelection"
  id: ProfessionSelectionIds
  active: false
}

export type VariantCombatTechniquesSelection =
  Record<CombatTechniquesSelection> |
  Record<RemoveCombatTechniquesSelection>

const _RemoveCombatTechniquesSelection =
  fromDefault ("RemoveCombatTechniquesSelection")
              <RemoveCombatTechniquesSelection> ({
                id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
                active: false,
              })

export const RemoveCombatTechniquesSelection =
  _RemoveCombatTechniquesSelection ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    active: false,
  })

export const isRemoveCombatTechniquesSelection =
  (obj: AnyProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSelection> =>
    obj === RemoveCombatTechniquesSelection
