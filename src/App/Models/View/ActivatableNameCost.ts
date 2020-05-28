import { List } from "../../../Data/List"
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId"
import { ActivatableCombinedName } from "./ActivatableCombinedName"

export interface ActivatableNameCost {
  naming: ActivatableCombinedName
  active: ActiveObjectWithId
  finalCost: number | List<number>
  isAutomatic: boolean
}

export interface ActivatableNameCostSafeCost extends ActivatableNameCost {
  finalCost: number
}
