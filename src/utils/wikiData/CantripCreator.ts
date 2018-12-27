import { Categories } from '../../constants/Categories';
import { Cantrip, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const CantripCreator =
  fromDefault<Cantrip> ({
    id: '',
    name: '',
    property: 0,
    tradition: List.empty,
    category: Categories.CANTRIPS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    note: Nothing,
    src: List.empty,
  })

export const CantripG = makeGetters (CantripCreator)

export const createCantrip =
  (xs: Omit<Cantrip, 'category'>) => CantripCreator ({
    ...xs,
    category: Categories.CANTRIPS,
  })

export const isCantrip =
  (r: EntryWithCategory) => CantripG.category (r) === Categories.CANTRIPS
