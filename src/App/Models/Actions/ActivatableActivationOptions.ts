import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface ActivatableActivationOptions {
  "@@name": "ActivatableActivationOptions"
  id: string
  selectOptionId1: Maybe<string | number>
  selectOptionId2: Maybe<string | number>
  selectOptionId3: Maybe<string | number>
  input: Maybe<string>
  level: Maybe<number>
  cost: number
  customCost: Maybe<number>
}

// export interface ActivatableActivatePayload extends ActivatableActivateOptions {
//   wiki: Activatable
//   instance?: Record<ActivatableDependent>
// }

export const ActivatableActivationOptions =
  fromDefault ("ActivatableActivationOptions")
              <ActivatableActivationOptions> ({
                id: "",
                selectOptionId1: Nothing,
                selectOptionId2: Nothing,
                selectOptionId3: Nothing,
                input: Nothing,
                level: Nothing,
                cost: 0,
                customCost: Nothing,
              })

export const ActivatableActivationOptionsL = makeLenses (ActivatableActivationOptions)
