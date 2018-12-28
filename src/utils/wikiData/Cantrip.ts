import { Categories } from '../../constants/Categories';
import { EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SourceLink } from './sub/SourceLink';

export interface Cantrip {
  id: string
  name: string
  property: number
  tradition: List<number>
  category: Categories
  effect: string
  range: string
  duration: string
  target: string
  note: Maybe<string>
  src: List<Record<SourceLink>>
}

export const Cantrip =
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

export const CantripG = makeGetters (Cantrip)

export const isCantrip =
  (r: EntryWithCategory) => CantripG.category (r) === Categories.CANTRIPS
