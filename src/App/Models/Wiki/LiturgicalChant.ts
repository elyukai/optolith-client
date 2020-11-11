import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { Aspect, BlessedGroup, BlessedTradition } from "../../Constants/Groups"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { CheckModifier, EntryWithCategory } from "./wikiTypeHelpers"

export interface LiturgicalChant {
  "@@name": "LiturgicalChant"
  id: string
  name: string
  nameShort: Maybe<string>
  aspects: List<Aspect>
  category: Category
  check: List<string>
  checkmod: Maybe<CheckModifier>
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
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LiturgicalChant =
  fromDefault ("LiturgicalChant")
              <LiturgicalChant> ({
                id: "",
                name: "",
                nameShort: Nothing,
                aspects: List.empty,
                category: Category.LITURGICAL_CHANTS,
                check: List.empty,
                checkmod: Nothing,
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
                errata: List (),
              })

export const LiturgicalChantL = makeLenses (LiturgicalChant)

export const isLiturgicalChant =
  (r: EntryWithCategory) => LiturgicalChant.AL.category (r) === Category.LITURGICAL_CHANTS
