import { Categories } from '../../constants/Categories';
import { CombatTechnique, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

const CombatTechniqueCreator =
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

export const CombatTechniqueG = makeGetters (CombatTechniqueCreator)

export const createCombatTechnique =
  (xs: Omit<CombatTechnique, 'category'>) => CombatTechniqueCreator ({
    ...xs,
    category: Categories.COMBAT_TECHNIQUES,
  })

export const isCombatTechnique =
  (r: EntryWithCategory) => CombatTechniqueG.category (r) === Categories.COMBAT_TECHNIQUES
