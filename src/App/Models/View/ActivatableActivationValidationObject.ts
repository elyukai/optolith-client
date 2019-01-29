import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";

export interface ActivatableActivationValidationObject extends ActiveObjectWithId {
  disabled: boolean
  maxLevel: Maybe<number>
  minLevel: Maybe<number>
}

export const ActivatableActivationValidationObject =
  fromDefault<ActivatableActivationValidationObject> ({
    id: "",
    index: -1,
    cost: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,

    disabled: false,
    maxLevel: Nothing,
    minLevel: Nothing,
  })
