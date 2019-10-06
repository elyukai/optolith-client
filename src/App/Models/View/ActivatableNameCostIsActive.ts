import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";
import { ActivatableCombinedName } from "./ActivatableCombinedName";
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "./ActivatableNameCost";

export interface ActivatableNameCostIsActive {
  "@@name": "ActivatableNameCostIsActive"
  nameAndCost: Record<ActivatableNameCostSafeCost>
  isActive: boolean
}

export const ActivatableNameCostIsActive =
  fromDefault ("ActivatableNameCostIsActive")
              <ActivatableNameCostIsActive> ({
                nameAndCost:
                  ActivatableNameCost.default as Record<ActivatableNameCostSafeCost>,
                isActive: false,
              })

export const ActivatableNameCostIsActiveA_ = {
  id: pipe (
    ActivatableNameCostIsActive.A.nameAndCost,
    ActivatableNameCost.A.active,
    ActiveObjectWithId.A.id
  ),
  name: pipe (
    ActivatableNameCostIsActive.A.nameAndCost,
    ActivatableNameCost.A.naming,
    ActivatableCombinedName.A.name
  ),
  finalCost: pipe (
    ActivatableNameCostIsActive.A.nameAndCost,
    ActivatableNameCost.A.finalCost as (x: Record<ActivatableNameCostSafeCost>) => number
  ),
}

export const ActivatableNameCostL = makeLenses (ActivatableNameCostIsActive)
