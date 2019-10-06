import { List } from "../../../Data/List";
import { Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { AdvantageDisadvantageBase, EntryWithCategory } from "./wikiTypeHelpers";

export interface Advantage extends AdvantageDisadvantageBase {
  "@@name": "Advantage"
}

export const Advantage =
  fromDefault ("Advantage")
              <Advantage> ({
                id: "",
                name: "",
                cost: Nothing,
                input: Nothing,
                max: Nothing,
                prerequisites: List.empty,
                prerequisitesText: Nothing,
                prerequisitesTextIndex: OrderedMap.empty,
                prerequisitesTextStart: Nothing,
                prerequisitesTextEnd: Nothing,
                tiers: Nothing,
                select: Nothing,
                gr: 0,
                src: List.empty,
                rules: "",
                range: Nothing,
                actions: Nothing,
                apValue: Nothing,
                apValueAppend: Nothing,
                category: Categories.ADVANTAGES,
              })

export const isAdvantage =
  (r: EntryWithCategory) => Advantage.AL.category (r) === Categories.ADVANTAGES

export const AdvantageL = makeLenses (Advantage)
