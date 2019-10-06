import { List } from "../../../Data/List";
import { OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { Aspect, BlessedGroup, BlessedTradition } from "../../Constants/Groups";
import { SourceLink } from "./sub/SourceLink";
import { CheckModifier, EntryWithCategory } from "./wikiTypeHelpers";

export interface LiturgicalChant {
  "@@name": "LiturgicalChant"
  id: string
  name: string
  aspects: List<Aspect>
  category: Categories
  check: List<string>
  checkmod: OrderedSet<CheckModifier>
  gr: BlessedGroup
  ic: number
  tradition: List<BlessedTradition>
  effect: string
  castingTime: string
  castingTimeShort: string
  castingTimeNoMod: boolean
  cost: string
  costShort: string
  costNoMod: boolean
  range: string
  rangeShort: string
  rangeNoMod: boolean
  duration: string
  durationShort: string
  durationNoMod: boolean
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
                castingTimeNoMod: false,
                cost: "",
                costShort: "",
                costNoMod: false,
                range: "",
                rangeShort: "",
                rangeNoMod: false,
                duration: "",
                durationShort: "",
                durationNoMod: false,
                target: "",
                src: List.empty,
              })

export const LiturgicalChantL = makeLenses (LiturgicalChant)

export const isLiturgicalChant =
  (r: EntryWithCategory) => LiturgicalChant.AL.category (r) === Categories.LITURGIES
