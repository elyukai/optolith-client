import { Categories } from '../../constants/Categories';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, Record } from '../structures/Record';
import { SourceLink } from './sub/SourceLink';
import { EntryWithCategory } from './wikiTypeHelpers';

export interface CombatTechnique {
  id: string
  name: string
  category: Categories
  gr: number
  ic: number
  bf: number
  primary: List<string>
  special: Maybe<string>
  src: List<Record<SourceLink>>
}

export const CombatTechnique =
  fromDefault<CombatTechnique> ({
    id: '',
    name: '',
    category: Categories.COMBAT_TECHNIQUES,
    gr: 0,
    ic: 0,
    bf: 0,
    primary: List.empty,
    special: Nothing,
    src: List.empty,
  })

export const isCombatTechnique =
  (r: EntryWithCategory) => CombatTechnique.A.category (r) === Categories.COMBAT_TECHNIQUES
