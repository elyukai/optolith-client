import { isJust } from "../../../Data/Maybe"
import { ItemEditorSpecific } from "./heroTypeHelpers"
import { ItemBase } from "./Item"

export interface EditItem extends ItemBase, ItemEditorSpecific { }

export interface EditItemSafe extends EditItem {
  id: string
}

export const ensureEditId =
  (x: EditItem): x is EditItemSafe => isJust (x.id)
