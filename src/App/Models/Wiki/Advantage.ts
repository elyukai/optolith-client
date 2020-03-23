import { List } from "../../../Data/List"
import { Nothing } from "../../../Data/Maybe"
import { empty } from "../../../Data/OrderedMap"
import { fromDefault, makeLenses } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { AdvantageDisadvantageBase, EntryWithCategory } from "./wikiTypeHelpers"

export interface Advantage extends AdvantageDisadvantageBase {
  "@@name": "Advantage"
  noMaxAPInfluence: boolean
  isExclusiveToArcaneSpellworks: boolean
}

export const Advantage =
  fromDefault ("Advantage")
              <Advantage> ({
                id: "",
                name: "",
                cost: Nothing,
                noMaxAPInfluence: false,
                isExclusiveToArcaneSpellworks: false,
                input: Nothing,
                max: Nothing,
                prerequisites: List.empty,
                prerequisitesText: Nothing,
                prerequisitesTextIndex: {
                  activatable: empty,
                  activatableMultiEntry: empty,
                  activatableMultiSelect: empty,
                  increasable: empty,
                  increasableMultiEntry: empty,
                  levels: empty,
                },
                prerequisitesTextStart: Nothing,
                prerequisitesTextEnd: Nothing,
                tiers: Nothing,
                select: Nothing,
                gr: 0,
                src: List.empty,
                errata: List (),
                rules: "",
                range: Nothing,
                actions: Nothing,
                apValue: Nothing,
                apValueAppend: Nothing,
                category: Category.ADVANTAGES,
              })

export const isAdvantage =
  (r: EntryWithCategory) => Advantage.AL.category (r) === Category.ADVANTAGES

export const AdvantageL = makeLenses (Advantage)
