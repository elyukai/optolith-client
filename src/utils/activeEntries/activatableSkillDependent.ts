import { ActivatableSkillDependent, ExtendedSkillDependency } from '../../types/data';
import { fromElements } from '../structures/List.new';
import { fromDefault, makeGetters, makeLenses_, Omit, Record } from '../structures/Record.new';

const ActivatableSkillDependentCreator =
  fromDefault<ActivatableSkillDependent> ({
    id: '',
    value: 0,
    active: false,
    dependencies: fromElements<ExtendedSkillDependency> (),
  })

export const ActivatableSkillDependentG = makeGetters (ActivatableSkillDependentCreator)

export const ActivatableSkillDependentL = makeLenses_ (ActivatableSkillDependentG)
                                                      (ActivatableSkillDependentCreator)

const createActivatableSkillDependent =
  (options: Partial<Omit<ActivatableSkillDependent, 'id'>>) =>
  (id: string): Record<ActivatableSkillDependent> =>
    ActivatableSkillDependentCreator ({ id, ...options })

export const createInactiveActivatableSkillDependent = createActivatableSkillDependent ({})

export const createActiveActivatableSkillDependent =
  createActivatableSkillDependent ({ active: true })

export const createActivatableSkillDependentWithValue =
  (value: number) => createActivatableSkillDependent ({ active: true, value })
