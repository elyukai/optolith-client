import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";
import { Categories } from "../../Constants/Categories";
import { ActivatableBase, EntryWithCategory } from "./wikiTypeHelpers";

export interface SpecialAbility extends ActivatableBase {
  "@@name": "SpecialAbility"
  extended: Maybe<List<string | List<string>>>
  nameInWiki: Maybe<string>
  subgr: Maybe<number>
  combatTechniques: Pair<boolean | List<string>, Maybe<string>>
  rules: Maybe<string>
  effect: Maybe<string>
  volume: Maybe<string>
  penalty: Maybe<string>
  aeCost: Maybe<string>
  protectiveCircle: Maybe<string>
  wardingCircle: Maybe<string>
  bindingCost: Maybe<string>
  property: Maybe<number | string>
  aspect: Maybe<number | string>
  apValue: Maybe<string>
  apValueAppend: Maybe<string>
  brew: Maybe<number>
}

export const SpecialAbility =
  fromDefault ("SpecialAbility")
              <SpecialAbility> ({
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
                extended: Nothing,
                nameInWiki: Nothing,
                subgr: Nothing,
                combatTechniques: Pair (false, Nothing),
                rules: Nothing,
                effect: Nothing,
                volume: Nothing,
                penalty: Nothing,
                aeCost: Nothing,
                protectiveCircle: Nothing,
                wardingCircle: Nothing,
                bindingCost: Nothing,
                property: Nothing,
                aspect: Nothing,
                apValue: Nothing,
                apValueAppend: Nothing,
                brew: Nothing,
                category: Categories.SPECIAL_ABILITIES,
              })

export const isSpecialAbility =
  (r: EntryWithCategory): r is Record<SpecialAbility> =>
    SpecialAbility.AL.category (r) === Categories.SPECIAL_ABILITIES

export const SpecialAbilityL = makeLenses (SpecialAbility)
