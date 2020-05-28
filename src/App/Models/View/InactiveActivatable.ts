import { List } from "../../../Data/List"
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { SelectOption } from "../Wiki/sub/SelectOption"
import { Activatable } from "../Wiki/wikiTypeHelpers"

export interface InactiveActivatable<T extends Activatable = Activatable> {
  id: string
  name: string
  cost?: string | number | List<number>
  minLevel?: number
  maxLevel?: number
  selectOptions?: List<SelectOption>
  heroEntry?: ActivatableDependent
  wikiEntry: T
  customCostDisabled?: boolean
  isAutomatic: boolean
}
