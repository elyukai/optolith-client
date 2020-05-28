import { Item as ItemTemplate } from "../Static_Item.gen"
import { DropdownOption } from "../View/DropdownOption"

export { ItemTemplate }

export const itemTemplateToDropdown =
  (x: ItemTemplate): DropdownOption<number> => ({ id: x.id, name: x.name })
