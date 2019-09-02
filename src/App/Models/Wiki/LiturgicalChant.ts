import { List } from "../../../Data/List";
import { OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { SourceLink } from "./sub/SourceLink";
import { CheckModifier, EntryWithCategory } from "./wikiTypeHelpers";

export interface LiturgicalChant {
  "@@name": "LiturgicalChant"
  id: string
  name: string
  aspects: List<number>
  category: Categories
  check: List<string>
  checkmod: OrderedSet<CheckModifier>
  gr: number
  ic: number
  tradition: List<number>
  effect: string
  castingTime: string
  castingTimeShort: string
  cost: string
  costShort: string
  range: string
  rangeShort: string
  duration: string
  durationShort: string
  target: string
  src: List<Record<SourceLink>>
}

export const LiturgicalChant =
  fromDefault ("LiturgicalChant")
              <LiturgicalChant> ({
                id: "",
                name: "",
                aspects: List.empty,
                category: Categories.LITURGIES,
                check: List.empty,
                checkmod: OrderedSet.empty,
                gr: 0,
                ic: 0,
                tradition: List.empty,
                effect: "",
                castingTime: "",
                castingTimeShort: "",
                cost: "",
                costShort: "",
                range: "",
                rangeShort: "",
                duration: "",
                durationShort: "",
                target: "",
                src: List.empty,
              })

export const LiturgicalChantL = makeLenses (LiturgicalChant)

export const isLiturgicalChant =
  (r: EntryWithCategory) => LiturgicalChant.AL.category (r) === Categories.LITURGIES
