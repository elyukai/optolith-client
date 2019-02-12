import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record, RecordI } from "../../../Data/Record";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { SelectOption } from "../Wiki/sub/SelectOption";
import { Activatable } from "../Wiki/wikiTypeHelpers";

export interface InactiveActivatable<T extends RecordI<Activatable> = RecordI<Activatable>> {
  id: string
  name: string
  cost: Maybe<string | number | List<number>>
  minLevel: Maybe<number>
  maxLevel: Maybe<number>
  selectOptions: Maybe<List<Record<SelectOption>>>
  heroEntry: Maybe<Record<ActivatableDependent>>
  wikiEntry: Record<T>
  customCostDisabled: Maybe<boolean>
}

export const InactiveActivatable =
  fromDefault<InactiveActivatable> ({
    id: "",
    name: "",
    cost: Nothing,
    maxLevel: Nothing,
    minLevel: Nothing,
    selectOptions: Nothing,
    heroEntry: Nothing,
    wikiEntry: Advantage.default,
    customCostDisabled: Nothing,
  })

export const InactiveActivatableL = makeLenses (InactiveActivatable)
