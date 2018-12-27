import { Categories } from '../../constants/Categories';
import { Advantage, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const AdvantageCreator =
  fromDefault<Advantage> ({
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
    category: Categories.ADVANTAGES,
  })

export const AdvantageG = makeGetters (AdvantageCreator)

export const createAdvantage =
  (xs: Omit<Advantage, 'category'>) => AdvantageCreator ({
    ...xs,
    category: Categories.ADVANTAGES,
  })

export const isAdvantage =
  (r: EntryWithCategory) => AdvantageG.category (r) === Categories.ADVANTAGES
