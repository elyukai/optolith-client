import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record"

export type RadioOptionValue = string | number

export interface RadioOption<A extends RadioOptionValue = RadioOptionValue> {
  "@@name": "RadioOption"
  className: Maybe<string>
  disabled: Maybe<boolean>
  name: string
  value: Maybe<A>
}

export interface RadioOptionCreator extends RecordCreator<RadioOption<any>> {
  <A extends RadioOptionValue = RadioOptionValue>
  (x: PartialMaybeOrNothing<OmitName<RadioOption<A>>>): Record<RadioOption<A>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RadioOption: RadioOptionCreator =
  fromDefault ("RadioOption") <RadioOption<any>> ({
                className: Nothing,
                disabled: Nothing,
                name: "",
                value: Nothing,
              })
