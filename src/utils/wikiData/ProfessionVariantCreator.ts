import { Categories } from '../../constants/Categories';
import { EntryWithCategory, ProfessionVariant } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const ProfessionVariantCreator =
  fromDefault<ProfessionVariant> ({
    id: '',
    name: '',
    ap: 0,
    apOfActivatables: 0,
    dependencies: List.empty,
    prerequisites: List.empty,
    selections: List.empty,
    specialAbilities: List.empty,
    combatTechniques: List.empty,
    skills: List.empty,
    spells: List.empty,
    liturgicalChants: List.empty,
    blessings: List.empty,
    precedingText: Nothing,
    fullText: Nothing,
    concludingText: Nothing,
    category: Categories.PROFESSION_VARIANTS,
  })

export const ProfessionVariantG = makeGetters (ProfessionVariantCreator)

export const createProfessionVariant =
  (xs: Omit<ProfessionVariant, 'category'>) => ProfessionVariantCreator ({
    ...xs,
    category: Categories.PROFESSION_VARIANTS,
  })

export const isProfessionVariant =
  (r: EntryWithCategory) => ProfessionVariantG.category (r) === Categories.PROFESSION_VARIANTS
