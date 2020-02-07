import { fromDefault, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { EntryWithCategory } from "./wikiTypeHelpers"

export interface Attribute {
  "@@name": "Attribute"
  id: string
  name: string
  category: Category
  short: string
}

export const Attribute =
  fromDefault ("Attribute")
              <Attribute> ({
                id: "",
                name: "",
                short: "",
                category: Category.ATTRIBUTES,
              })

export const isAttribute =
  (r: EntryWithCategory): r is Record<Attribute> =>
    Attribute.AL.category (r) === Category.ATTRIBUTES
