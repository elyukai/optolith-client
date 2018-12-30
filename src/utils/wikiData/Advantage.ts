import { Categories } from '../../constants/Categories';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault } from '../structures/Record';
import { AdvantageDisadvantageBase, EntryWithCategory } from './wikiTypeHelpers';

export interface Advantage extends AdvantageDisadvantageBase { }

export const Advantage =
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

export const isAdvantage =
  (r: EntryWithCategory) => Advantage.A.category (r) === Categories.ADVANTAGES
