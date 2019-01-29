import { List } from "../../../Data/List";
import { Nothing } from "../../../Data/Maybe";
import { fromDefault, Omit } from "../../../Data/Record";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";
import { ActivatableCombinedName } from "./ActivatableCombinedName";

export interface ActivatableNameCost
  extends Omit<ActiveObjectWithId, "cost">, ActivatableCombinedName {
    finalCost: number | List<number>
  }

export const ActivatableNameCost =
  fromDefault<ActivatableNameCost> ({
    name: "",
    baseName: "",
    addName: Nothing,

    id: "",
    index: -1,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,

    finalCost: 0,
  })
