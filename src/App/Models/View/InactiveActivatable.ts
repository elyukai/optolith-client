import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record, RecordI } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { SelectOption } from "../Wiki/sub/SelectOption";
import { Activatable } from "../Wiki/wikiTypeHelpers";

export interface InactiveActivatable<T extends RecordI<Activatable> = RecordI<Activatable>> {
  "@@name": "InactiveActivatable"
  id: string
  name: string
  cost: Maybe<string | number | List<number>>
  minLevel: Maybe<number>
  maxLevel: Maybe<number>
  selectOptions: Maybe<List<Record<SelectOption>>>
  heroEntry: Maybe<Record<ActivatableDependent>>
  wikiEntry: Record<T>
  customCostDisabled: Maybe<boolean>
  isAutomatic: boolean
}

export const InactiveActivatable =
  fromDefault ("InactiveActivatable")
              <InactiveActivatable> ({
                id: "",
                name: "",
                cost: Nothing,
                maxLevel: Nothing,
                minLevel: Nothing,
                selectOptions: Nothing,
                heroEntry: Nothing,
                wikiEntry: Advantage.default,
                customCostDisabled: Nothing,
                isAutomatic: false,
              })

export const InactiveActivatableA_ = {
  src: pipe (InactiveActivatable.A.wikiEntry, Advantage.AL.src),
}

export const InactiveActivatableL = makeLenses (InactiveActivatable)
