import { Categories } from '../../constants/Categories';
import { ActivatableBase, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters } from '../structures/Record';

export interface SpecialAbility extends ActivatableBase {
  extended: Maybe<List<string | List<string>>>
  nameInWiki: Maybe<string>
  subgr: Maybe<number>
  combatTechniques: Maybe<string>
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
}

export const SpecialAbility =
  fromDefault<SpecialAbility> ({
    id: '',
    name: '',
    cost: 0,
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
    category: Categories.SPECIAL_ABILITIES,
  })

export const SpecialAbilityG = makeGetters (SpecialAbility)

export const isSpecialAbility =
  (r: EntryWithCategory) => SpecialAbilityG.category (r) === Categories.SPECIAL_ABILITIES
