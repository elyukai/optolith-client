import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";
import { Categories } from "../../Constants/Categories";
import { Die } from "./sub/Die";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Race {
  "@@name": "Race"
  id: string
  name: string
  ap: number
  lp: number
  spi: number
  tou: number
  mov: number
  attributeAdjustments: List<Pair<string, number>>
  attributeAdjustmentsSelection: Pair<number, List<string>>
  attributeAdjustmentsText: string
  commonCultures: List<string>
  automaticAdvantages: List<string>
  automaticAdvantagesText: Maybe<string>
  stronglyRecommendedAdvantages: List<string>
  stronglyRecommendedAdvantagesText: Maybe<string>
  stronglyRecommendedDisadvantages: List<string>
  stronglyRecommendedDisadvantagesText: Maybe<string>
  commonAdvantages: List<string>
  commonAdvantagesText: Maybe<string>
  commonDisadvantages: List<string>
  commonDisadvantagesText: Maybe<string>
  uncommonAdvantages: List<string>
  uncommonAdvantagesText: Maybe<string>
  uncommonDisadvantages: List<string>
  uncommonDisadvantagesText: Maybe<string>
  hairColors: Maybe<List<number>>
  eyeColors: Maybe<List<number>>
  sizeBase: Maybe<number>
  sizeRandom: Maybe<List<Record<Die>>>
  weightBase: number
  weightRandom: List<Record<Die>>
  variants: List<string>
  category: Categories
  src: List<Record<SourceLink>>
}

export const Race =
  fromDefault ("Race")
              <Race> ({
                id: "",
                name: "",
                ap: 0,
                lp: 0,
                spi: 0,
                tou: 0,
                mov: 0,
                attributeAdjustments: List.empty,
                attributeAdjustmentsSelection: Pair<number, List<string>> (0, List.empty),
                attributeAdjustmentsText: "",
                commonCultures: List.empty,
                automaticAdvantages: List.empty,
                automaticAdvantagesText: Nothing,
                stronglyRecommendedAdvantages: List.empty,
                stronglyRecommendedAdvantagesText: Nothing,
                stronglyRecommendedDisadvantages: List.empty,
                stronglyRecommendedDisadvantagesText: Nothing,
                commonAdvantages: List.empty,
                commonAdvantagesText: Nothing,
                commonDisadvantages: List.empty,
                commonDisadvantagesText: Nothing,
                uncommonAdvantages: List.empty,
                uncommonAdvantagesText: Nothing,
                uncommonDisadvantages: List.empty,
                uncommonDisadvantagesText: Nothing,
                hairColors: Nothing,
                eyeColors: Nothing,
                sizeBase: Nothing,
                sizeRandom: Nothing,
                weightBase: 0,
                weightRandom: List.empty,
                variants: List.empty,
                category: Categories.RACES,
                src: List.empty,
              })

export const RaceL = makeLenses (Race)

export const isRace =
  (r: EntryWithCategory) => Race.AL.category (r) === Categories.RACES
