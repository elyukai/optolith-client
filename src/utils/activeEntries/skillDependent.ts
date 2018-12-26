import { add, pipe } from 'ramda';
import { Dependent, ExtendedSkillDependent, SkillDependency, SkillDependent } from '../../types/data';
import { fnull, fromElements } from '../structures/List';
import { fromJust, isJust, Just, Maybe } from '../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, notMember, Omit, Record } from '../structures/Record';

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
    SkillDependentCreator ({
      id,
      value: 0,
      dependencies: fromElements<SkillDependency> (),
      ...options,
    })

export const createPlainSkillDependent = createSkillDependent ({ })

export const createSkillDependentWithValue = (x: number) => createSkillDependent ({ value: x })

export const createSkillDependentWithBaseValue6 = pipe (add (6), createSkillDependentWithValue)

export const createSkillDependentWithValue6 = createSkillDependent ({ value: 6 })

export const isMaybeSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<SkillDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && notMember ('mod') (fromJust (entry))
    && notMember ('active') (fromJust (entry))

export const isSkillDependent =
  (entry: Dependent): entry is Record<SkillDependent> =>
    member ('value') (entry)
    && notMember ('mod') (entry)
    && notMember ('active') (entry)

export const isExtendedSkillDependent =
  (entry: Dependent): entry is ExtendedSkillDependent =>
    member ('value') (entry)
    && notMember ('mod') (entry)

const { value, dependencies } = SkillDependentG

export const isDependentSkillUnused =
  (entry: Record<SkillDependent>): boolean =>
    value (entry) === 0
    && fnull (dependencies (entry))
