import { Categories } from '../../constants/Categories';
import { EntryWithCategory, Race } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromBoth } from '../structures/Pair';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

const RaceCreator =
  fromDefault<Race> ({
    id: '',
    name: '',
    ap: 0,
    lp: 0,
    spi: 0,
    tou: 0,
    mov: 0,
    attributeAdjustments: List.empty,
    attributeAdjustmentsSelection: fromBoth<number, List<string>> (0) (List.empty),
    attributeAdjustmentsText: '',
    commonCultures: List.empty,
    automaticAdvantages: List.empty,
    automaticAdvantagesText: '',
    stronglyRecommendedAdvantages: List.empty,
    stronglyRecommendedAdvantagesText: '',
    stronglyRecommendedDisadvantages: List.empty,
    stronglyRecommendedDisadvantagesText: '',
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
    weightBase: 0,
    weightRandom: List.empty,
    variants: List.empty,
    category: Categories.RACES,
    src: List.empty,
  })

export const RaceG = makeGetters (RaceCreator)

export const createRace =
  (xs: Omit<Race, 'category'>) => RaceCreator ({
    ...xs,
    category: Categories.RACES,
  })

export const isRace =
  (r: EntryWithCategory) => RaceG.category (r) === Categories.RACES
