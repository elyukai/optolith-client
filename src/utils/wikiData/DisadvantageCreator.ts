import { Categories } from '../../constants/Categories';
import { Disadvantage } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const DisadvantageCreator =
  fromDefault<Disadvantage> ({
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
    rules: '',
    range: Nothing,
    actions: Nothing,
    apValue: Nothing,
    apValueAppend: Nothing,
    category: Categories.DISADVANTAGES,
  })

export const DisadvantageG = makeGetters (DisadvantageCreator)

export const createDisadvantage: RequiredExceptCategoryFunction<Disadvantage> = DisadvantageCreator
