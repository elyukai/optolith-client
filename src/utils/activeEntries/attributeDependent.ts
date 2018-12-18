import { AttributeDependent, SkillDependency } from '../../types/data';
import { fromElements } from '../structures/List.new';
import { fromDefault, makeGetters, makeLenses_, Omit, Record } from '../structures/Record.new';

const AttributeDependentCreator =
  fromDefault<AttributeDependent> ({
    id: '',
    value: 8,
    mod: 0,
    dependencies: fromElements<SkillDependency> (),
  })

export const AttributeDependentG = makeGetters (AttributeDependentCreator)

export const AttributeDependentL = makeLenses_ (AttributeDependentG) (AttributeDependentCreator)

export const createAttributeDependent =
  (options: Partial<Omit<AttributeDependent, 'id'>>) =>
  (id: string): Record<AttributeDependent> =>
    AttributeDependentCreator ({ id, ...options })
