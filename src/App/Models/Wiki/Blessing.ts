import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { BlessedTradition } from "../../Constants/Groups";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Blessing {
  "@@name": "Blessing"
  id: string
  name: string
  tradition: List<BlessedTradition>
  category: Categories
  effect: string
  range: string
  duration: string
  target: string
  src: List<Record<SourceLink>>
}

export const Blessing =
  fromDefault ("Blessing")
              <Blessing> ({
                id: "",
                name: "",
                tradition: List.empty,
                category: Categories.BLESSINGS,
                effect: "",
                range: "",
                duration: "",
                target: "",
                src: List.empty,
              })

export const isBlessing =
  (r: EntryWithCategory) => Blessing.AL.category (r) === Categories.BLESSINGS
