import { List } from "../../../Data/List"
import { fromDefault, Lenses, makeLenses, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record"
import { composeL } from "../../Utilities/compose"
import { pipe } from "../../Utilities/pipe"
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId"
import { ActivatableCombinedName, ActivatableCombinedNameL } from "./ActivatableCombinedName"

export interface ActivatableNameCost {
  "@@name": "ActivatableNameCost"
  naming: Record<ActivatableCombinedName>
  active: Record<ActiveObjectWithId>
  finalCost: number | List<number>
  isAutomatic: boolean
}

export interface ActivatableNameCostSafeCost extends ActivatableNameCost {
  finalCost: number
}

interface ActivatableNameCostConstructor extends RecordCreator<ActivatableNameCost> {
  (x: PartialMaybeOrNothing<OmitName<ActivatableNameCostSafeCost>>):
  Record<ActivatableNameCostSafeCost>
  default: Record<ActivatableNameCostSafeCost>
}

export const ActivatableNameCost =
  fromDefault ("ActivatableNameCost")
              <ActivatableNameCost> ({
                naming: ActivatableCombinedName.default,
                active: ActiveObjectWithId.default,
                finalCost: 0,
                isAutomatic: false,
              }) as ActivatableNameCostConstructor

export const ActivatableNameCostA_ = {
  id: pipe (ActivatableNameCost.A.active, ActiveObjectWithId.A.id),
  index: pipe (ActivatableNameCost.A.active, ActiveObjectWithId.A.index),
  tier: pipe (ActivatableNameCost.A.active, ActiveObjectWithId.A.tier),
  customCost: pipe (ActivatableNameCost.A.active, ActiveObjectWithId.A.cost),
  name: pipe (ActivatableNameCost.A.naming, ActivatableCombinedName.A.name),
  addName: pipe (ActivatableNameCost.A.naming, ActivatableCombinedName.A.addName),
  baseName: pipe (ActivatableNameCost.A.naming, ActivatableCombinedName.A.baseName),
  levelName: pipe (ActivatableNameCost.A.naming, ActivatableCombinedName.A.levelName),
}

export const ActivatableNameCostL = makeLenses (ActivatableNameCost)

export const ActivatableNameCostSafeCostL =
  ActivatableNameCostL as Lenses<ActivatableNameCostSafeCost>

export const ActivatableNameCostL_ = {
  name: composeL (ActivatableNameCostL.naming, ActivatableCombinedNameL.name),
  addName: composeL (ActivatableNameCostL.naming, ActivatableCombinedNameL.addName),
  baseName: composeL (ActivatableNameCostL.naming, ActivatableCombinedNameL.baseName),
  levelName: composeL (ActivatableNameCostL.naming, ActivatableCombinedNameL.levelName),
}
