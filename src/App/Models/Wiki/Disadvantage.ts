import { Categories } from "../../../constants/Categories";
import { List } from "../../../Data/List";
import { Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault } from "../../../Data/Record";
import { AdvantageDisadvantageBase, EntryWithCategory } from "./wikiTypeHelpers";

export interface Disadvantage extends AdvantageDisadvantageBase { }

export const Disadvantage =
  fromDefault<Disadvantage> ({
    id: "",
    name: "",
    cost: 0,
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
    category: Categories.DISADVANTAGES,
  })

export const isDisadvantage =
  (r: EntryWithCategory) => Disadvantage.A.category (r) === Categories.DISADVANTAGES
