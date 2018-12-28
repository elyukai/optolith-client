import { Categories } from '../../constants/Categories';
import { EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SourceLink } from './sub/SourceLink';

export interface Blessing {
  id: string
  name: string
  aspects: List<number>
  tradition: List<number>
  category: Categories
  effect: string
  range: string
  duration: string
  target: string
  src: List<Record<SourceLink>>
}

export const Blessing =
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

export const BlessingG = makeGetters (Blessing)

export const isBlessing =
  (r: EntryWithCategory) => BlessingG.category (r) === Categories.BLESSINGS
