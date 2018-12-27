import { Categories } from '../../constants/Categories';
import { Disadvantage, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const DisadvantageCreator =
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

export const createDisadvantage =
  (xs: Omit<Disadvantage, 'category'>) => DisadvantageCreator ({
    ...xs,
    category: Categories.DISADVANTAGES,
  })

export const isDisadvantage =
  (r: EntryWithCategory) => DisadvantageG.category (r) === Categories.DISADVANTAGES
