import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { Die } from "./sub/Die"
import { EntryWithCategory } from "./wikiTypeHelpers"

export interface RaceVariant {
  "@@name": "RaceVariant"
  id: string
  name: string
  commonCultures: List<string>
  commonAdvantages: List<string>
  commonAdvantagesText: Maybe<string>
  commonDisadvantages: List<string>
  commonDisadvantagesText: Maybe<string>
  uncommonAdvantages: List<string>
  uncommonAdvantagesText: Maybe<string>
  uncommonDisadvantages: List<string>
  uncommonDisadvantagesText: Maybe<string>
  hairColors: List<number>
  eyeColors: List<number>
  sizeBase: number
  sizeRandom: List<Record<Die>>
  category: Category
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RaceVariant =
  fromDefault ("RaceVariant")
              <RaceVariant> ({
                id: "",
                name: "",
                commonCultures: List.empty,
                commonAdvantages: List.empty,
                commonAdvantagesText: Nothing,
                commonDisadvantages: List.empty,
                commonDisadvantagesText: Nothing,
                uncommonAdvantages: List.empty,
                uncommonAdvantagesText: Nothing,
                uncommonDisadvantages: List.empty,
                uncommonDisadvantagesText: Nothing,
                hairColors: List (),
                eyeColors: List (),
                sizeBase: 0,
                sizeRandom: List (),
                category: Category.RACE_VARIANTS,
              })

export const RaceVariantL = makeLenses (RaceVariant)

export const isRaceVariant =
  (r: EntryWithCategory) => RaceVariant.AL.category (r) === Category.RACE_VARIANTS
