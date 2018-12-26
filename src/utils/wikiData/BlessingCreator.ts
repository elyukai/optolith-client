import { Categories } from '../../constants/Categories';
import { Blessing, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

const BlessingCreator =
  fromDefault<Blessing> ({
    id: '',
    name: '',
    aspects: List.empty,
    tradition: List.empty,
    category: Categories.BLESSINGS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    src: List.empty,
  })

export const BlessingG = makeGetters (BlessingCreator)

export const createBlessing =
  (xs: Omit<Blessing, 'category'>) => BlessingCreator ({
    ...xs,
    category: Categories.BLESSINGS,
  })

export const isBlessing =
  (r: EntryWithCategory) => BlessingG.category (r) === Categories.BLESSINGS
