import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { empty } from "../../../Data/OrderedMap"
import { fromDefault, makeLenses, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { ActivatableBase } from "./wikiTypeHelpers"

export enum SpecialAbilityCombatTechniqueGroup {
  None = 0,
  All = 1,
  Melee = 2,
  Ranged = 3,
  WithParry = 4,
  OneHanded = 5,
}

export interface SpecialAbilityCombatTechniques {
  "@@name": "SpecialAbilityCombatTechniques"
  group: SpecialAbilityCombatTechniqueGroup
  explicitIds: List<string>
  customText: Maybe<string>
}

export const SpecialAbilityCombatTechniques =
  fromDefault ("SpecialAbilityCombatTechniques")
              <SpecialAbilityCombatTechniques> ({
                group: SpecialAbilityCombatTechniqueGroup.None,
                explicitIds: List.empty,
                customText: Nothing,
              })

export interface SpecialAbility extends ActivatableBase {
  "@@name": "SpecialAbility"
  extended: Maybe<List<string | List<string>>>
  nameInWiki: Maybe<string>
  subgr: Maybe<number>
  combatTechniques: Maybe<Record<SpecialAbilityCombatTechniques>>
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
                extended: Nothing,
                nameInWiki: Nothing,
                subgr: Nothing,
                combatTechniques: Nothing,
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
                category: Category.SPECIAL_ABILITIES,
              })

export const SpecialAbilityL = makeLenses (SpecialAbility)
