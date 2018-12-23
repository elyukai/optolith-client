import { Categories } from '../../constants/Categories';
import { RaceVariant } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const RaceVariantCreator =
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

export const createRaceVariant: RequiredExceptCategoryFunction<RaceVariant> = RaceVariantCreator
