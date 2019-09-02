import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface ActivatableActivationValidation {
  "@@name": "ActivatableActivationValidation"
  disabled: boolean
  maxLevel: Maybe<number>
  minLevel: Maybe<number>
}

export const ActivatableActivationValidation =
  fromDefault ("ActivatableActivationValidation")
              <ActivatableActivationValidation> ({
                disabled: false,
                maxLevel: Nothing,
                minLevel: Nothing,
              })
