import { Categories } from '../../constants/Categories';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, Record } from '../structures/Record';
import { SourceLink } from './sub/SourceLink';
import { EntryWithCategory } from './wikiTypeHelpers';

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

export const isCantrip =
  (r: EntryWithCategory) => Cantrip.A.category (r) === Categories.CANTRIPS
