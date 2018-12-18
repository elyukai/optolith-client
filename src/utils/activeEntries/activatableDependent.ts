import { ActivatableDependency, ActivatableDependent, ActiveObject } from '../../types/data';
import { fromElements } from '../structures/List.new';
import { fromDefault, makeGetters, makeLenses_, Omit, Record } from '../structures/Record.new';

const ActivatableDependentCreator =
  fromDefault<ActivatableDependent> ({
    id: '',
    active: fromElements<Record<ActiveObject>> (),
    dependencies: fromElements<ActivatableDependency> (),
  })

export const ActivatableDependentG = makeGetters (ActivatableDependentCreator)

export const ActivatableDependentL = makeLenses_ (ActivatableDependentG)
                                                 (ActivatableDependentCreator)

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, 'id'>>) =>
  (id: string): Record<ActivatableDependent> =>
    ActivatableDependentCreator ({ id, ...options })
