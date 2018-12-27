import { Categories } from '../../constants/Categories';
import { EntryWithCategory, RaceVariant } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const RaceVariantCreator =
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

export const RaceVariantG = makeGetters (RaceVariantCreator)

export const createRaceVariant =
  (xs: Omit<RaceVariant, 'category'>) => RaceVariantCreator ({
    ...xs,
    category: Categories.RACE_VARIANTS,
  })

export const isRaceVariant =
  (r: EntryWithCategory) => RaceVariantG.category (r) === Categories.RACE_VARIANTS
