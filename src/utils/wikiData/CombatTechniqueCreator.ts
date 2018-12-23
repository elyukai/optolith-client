import { Categories } from '../../constants/Categories';
import { CombatTechnique } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

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

export const createCombatTechnique: RequiredExceptCategoryFunction<CombatTechnique> =
  CombatTechniqueCreator
