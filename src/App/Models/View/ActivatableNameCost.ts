import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Omit } from "../../../Data/Record";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";
import { ActivatableCombinedName } from "./ActivatableCombinedName";

export interface ActivatableNameCost
  extends Omit<ActiveObjectWithId, "cost">, ActivatableCombinedName {
    finalCost: number | List<number>
    levelName: Maybe<string>
  }

export interface ActivatableNameCostSafeCost extends ActivatableNameCost {
  finalCost: number
}

export const ActivatableNameCost =
  fromDefault<ActivatableNameCost> ({
    name: "",
    baseName: "",
    addName: Nothing,
    levelName: Nothing,

    id: "",
    index: -1,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,

    finalCost: 0,
  })

export const ActivatableNameCostL = makeLenses (ActivatableNameCost)
