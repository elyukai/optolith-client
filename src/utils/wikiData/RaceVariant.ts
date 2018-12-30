import { Categories } from '../../constants/Categories';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, Record } from '../structures/Record';
import { Die } from './sub/Die';
import { EntryWithCategory } from './wikiTypeHelpers';

export interface RaceVariant {
  id: string
  name: string
  commonCultures: List<string>
  commonAdvantages: List<string>
  commonAdvantagesText: Maybe<string>
  commonDisadvantages: List<string>
  commonDisadvantagesText: Maybe<string>
  uncommonAdvantages: List<string>
  uncommonAdvantagesText: Maybe<string>
  uncommonDisadvantages: List<string>
  uncommonDisadvantagesText: Maybe<string>
  hairColors: Maybe<List<number>>
  eyeColors: Maybe<List<number>>
  sizeBase: Maybe<number>
  sizeRandom: Maybe<List<Record<Die>>>
  category: Categories
}

export const RaceVariant =
  fromDefault<RaceVariant> ({
    id: '',
    name: '',
    commonCultures: List.empty,
    commonAdvantages: List.empty,
    commonAdvantagesText: Nothing,
    commonDisadvantages: List.empty,
    commonDisadvantagesText: Nothing,
    uncommonAdvantages: List.empty,
    uncommonAdvantagesText: Nothing,
    uncommonDisadvantages: List.empty,
    uncommonDisadvantagesText: Nothing,
    hairColors: Nothing,
    eyeColors: Nothing,
    sizeBase: Nothing,
    sizeRandom: Nothing,
    category: Categories.RACE_VARIANTS,
  })

export const isRaceVariant =
  (r: EntryWithCategory) => RaceVariant.A.category (r) === Categories.RACE_VARIANTS
