import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";

export interface ActivatableActivationValidation extends ActiveObjectWithId {
  disabled: boolean
  maxLevel: Maybe<number>
  minLevel: Maybe<number>
}

export const ActivatableActivationValidation =
  fromDefault<ActivatableActivationValidation> ({
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
