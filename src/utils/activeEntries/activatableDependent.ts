import { ActivatableDependency, ActivatableDependent, ActiveObject, Dependent } from '../../types/data';
import { fnull, fromElements, List } from '../structures/List';
import { fromJust, isJust, Just, Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, notMember, Omit, Record } from '../structures/Record';

const ActivatableDependentCreator =
  fromDefault<ActivatableDependent> ({
    id: '',
    active: fromElements<Record<ActiveObject>> (),
    dependencies: fromElements<ActivatableDependency> (),
  })

export const ActivatableDependentG = makeGetters (ActivatableDependentCreator)

export const ActivatableDependentL = makeLenses_ (ActivatableDependentG)
                                                 (ActivatableDependentCreator)

export const ActiveObjectCreator =
  fromDefault<ActiveObject> ({
    cost: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const ActiveObjectG = makeGetters (ActiveObjectCreator)

export const ActiveObjectL = makeLenses_ (ActiveObjectG)
                                         (ActiveObjectCreator)

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, 'id'>>) =>
  (id: string): Record<ActivatableDependent> =>
    ActivatableDependentCreator ({
      id,
      active: fromElements<Record<ActiveObject>> (),
      dependencies: fromElements<ActivatableDependency> (),
      ...options,
    })

export const createActivatableDependentWithActive =
  (activeObjects: List<Record<ActiveObject>>) =>
    createActivatableDependent ({ active: activeObjects })

export const createPlainActivatableDependent = createActivatableDependent ({ })

export const isMaybeActivatableDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableDependent>> =>
    isJust (entry)
    && member ('active') (fromJust (entry))
    && notMember ('value') (fromJust (entry))

export const isActivatableDependent =
  (entry: Dependent): entry is Record<ActivatableDependent> =>
    member ('active') (entry)
    && notMember ('value') (entry)

const { active, dependencies } = ActivatableDependentG

export const isActivatableDependentUnused =
  (entry: Record<ActivatableDependent>): boolean =>
    fnull (active (entry))
    && fnull (dependencies (entry))
