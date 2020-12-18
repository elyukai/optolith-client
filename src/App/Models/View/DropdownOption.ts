import { Maybe, Nothing } from "../../../Data/Maybe"
import { Accessors, fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator, StrictAccessors } from "../../../Data/Record"

export type DropdownKey = string | number

export interface DropdownOption<A extends DropdownKey = DropdownKey> {
  "@@name": "DropdownOption"
  id: Maybe<A>
  name: string
  disabled: Maybe<boolean>
}

interface DropdownOptionAccessors extends Accessors<DropdownOption> {
  id:
  <A extends DropdownKey>
  (x: Record<Pick<OmitName<DropdownOption<A>>, "id"> & { "@@name": string }>) => Maybe<A>
}

interface DropdownOptionStrictAccessors extends StrictAccessors<DropdownOption> {
  id: <A extends DropdownKey> (x: Record<DropdownOption<A>>) => Maybe<A>
}

interface DropdownOptionCreator extends RecordCreator<DropdownOption> {
  <A extends DropdownKey = DropdownKey>
  (x: PartialMaybeOrNothing<OmitName<DropdownOption<A>>>): Record<DropdownOption<A>>
  readonly default: Record<DropdownOption>
  readonly AL: DropdownOptionAccessors
  readonly A: DropdownOptionStrictAccessors
  readonly is:
    <B, A extends DropdownKey> (x: B | Record<DropdownOption<A>>) => x is Record<DropdownOption<A>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DropdownOption: DropdownOptionCreator =
  fromDefault ("DropdownOption") <DropdownOption<any>> ({
                id: Nothing,
                name: "",
                disabled: Nothing,
              })
