import { ActivatableSkillDependent, Dependent, ExtendedSkillDependency } from '../../types/data';
import { fnull, fromElements } from '../structures/List';
import { fromJust, isJust, Just, Maybe } from '../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, Omit, Record } from '../structures/Record';

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
    ActivatableSkillDependentCreator ({
      id,
      value: 0,
      active: false,
      dependencies: fromElements<ExtendedSkillDependency> (),
      ...options,
    })

export const createInactiveActivatableSkillDependent = createActivatableSkillDependent ({})

export const createActiveActivatableSkillDependent =
  createActivatableSkillDependent ({ active: true })

export const createActivatableSkillDependentWithValue =
  (x: number) => createActivatableSkillDependent ({ active: true, value: x })

export const isMaybeActivatableSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableSkillDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && member ('active') (fromJust (entry))

export const isActivatableSkillDependent =
  (entry: Dependent): entry is Record<ActivatableSkillDependent> =>
    member ('value') (entry)
    && member ('active') (entry)

const { active, value, dependencies } = ActivatableSkillDependentG

export const isActivatableDependentSkillUnused =
  (entry: Record<ActivatableSkillDependent>): boolean =>
    value (entry) === 0
    && !active (entry)
    && fnull (dependencies (entry))
