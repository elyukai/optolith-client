import { Categories } from '../../constants/Categories';
import { SpecialAbility } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const SpecialAbilityCreator =
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

export const SpecialAbilityG = makeGetters (SpecialAbilityCreator)

export const createSpecialAbility: RequiredExceptCategoryFunction<SpecialAbility> =
  SpecialAbilityCreator
