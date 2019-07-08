import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromNamedDefault } from "../../../Data/Record";

export interface ActivatableActivationValidation {
  disabled: boolean
  maxLevel: Maybe<number>
  minLevel: Maybe<number>
}

export const ActivatableActivationValidation =
  fromNamedDefault ("ActivatableActivationValidation")
                   <ActivatableActivationValidation> ({
                     disabled: false,
                     maxLevel: Nothing,
                     minLevel: Nothing,
                   })
