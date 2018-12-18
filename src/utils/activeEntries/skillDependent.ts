import { add, pipe } from 'ramda';
import { SkillDependency, SkillDependent } from '../../types/data';
import { fromElements } from '../structures/List';
import { fromDefault, makeGetters, makeLenses_, Omit, Record } from '../structures/Record';

const SkillDependentCreator =
  fromDefault<SkillDependent> ({
    id: '',
    value: 0,
    dependencies: fromElements<SkillDependency> (),
  })

export const SkillDependentG = makeGetters (SkillDependentCreator)

export const SkillDependentL = makeLenses_ (SkillDependentG) (SkillDependentCreator)

export const createSkillDependent =
  (options: Partial<Omit<SkillDependent, 'id'>>) =>
  (id: string): Record<SkillDependent> =>
    SkillDependentCreator ({ id, ...options })

export const createPlainSkillDependent = createSkillDependent ({})

export const createSkillDependentWithValue = (value: number) => createSkillDependent ({ value })

export const createDependentSkillWithBaseValue6 = pipe (add (6), createSkillDependentWithValue)

export const createDependentSkillWithValue6 = createSkillDependent ({ value: 6 })
