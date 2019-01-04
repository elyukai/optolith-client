import { Categories } from "../../constants/Categories";
import { List } from "../structures/List";
import { Maybe, Nothing } from "../structures/Maybe";
import { fromBoth, Pair } from "../structures/Pair";
import { fromDefault, Record } from "../structures/Record";
import { Die } from "./sub/Die";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Race {
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
  automaticAdvantagesText: string
  stronglyRecommendedAdvantages: List<string>
  stronglyRecommendedAdvantagesText: string
  stronglyRecommendedDisadvantages: List<string>
  stronglyRecommendedDisadvantagesText: string
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
  fromDefault<Race> ({
    id: "",
    name: "",
    ap: 0,
    lp: 0,
    spi: 0,
    tou: 0,
    mov: 0,
    attributeAdjustments: List.empty,
    attributeAdjustmentsSelection: fromBoth<number, List<string>> (0) (List.empty),
    attributeAdjustmentsText: "",
    commonCultures: List.empty,
    automaticAdvantages: List.empty,
    automaticAdvantagesText: "",
    stronglyRecommendedAdvantages: List.empty,
    stronglyRecommendedAdvantagesText: "",
    stronglyRecommendedDisadvantages: List.empty,
    stronglyRecommendedDisadvantagesText: "",
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

export const isRace =
  (r: EntryWithCategory) => Race.A.category (r) === Categories.RACES
