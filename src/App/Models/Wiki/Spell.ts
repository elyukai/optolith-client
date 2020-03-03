import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { MagicalTradition, Property } from "../../Constants/Groups"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { AllRequirementObjects, CheckModifier, EntryWithCategory } from "./wikiTypeHelpers"

export interface Spell {
  "@@name": "Spell"
  id: string
  name: string
  check: List<string>
  checkmod: Maybe<CheckModifier>
  gr: number
  ic: number
  property: Property
  tradition: List<MagicalTradition>
  subtradition: List<number>
  prerequisites: List<AllRequirementObjects>
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
  category: Category
}

export const Spell =
  fromDefault ("Spell")
              <Spell> ({
                id: "",
                name: "",
                check: List.empty,
                checkmod: Nothing,
                gr: 0,
                ic: 0,
                property: 0,
                tradition: List.empty,
                subtradition: List.empty,
                prerequisites: List.empty,
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
                category: Category.SPELLS,
              })

export const SpellL = makeLenses (Spell)

export const isSpell =
  (r: EntryWithCategory) => Spell.AL.category (r) === Category.SPELLS
