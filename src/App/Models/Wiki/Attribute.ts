import { fromDefault, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Attribute {
  "@@name": "Attribute"
  id: string
  name: string
  category: Categories
  short: string
}

export const Attribute =
  fromDefault ("Attribute")
              <Attribute> ({
                id: "",
                name: "",
                short: "",
                category: Categories.ATTRIBUTES,
              })

export const isAttribute =
  (r: EntryWithCategory): r is Record<Attribute> =>
    Attribute.AL.category (r) === Categories.ATTRIBUTES
