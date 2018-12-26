import { Categories } from '../../constants/Categories';
import { Attribute, EntryWithCategory } from '../../types/wiki';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

const AttributeCreator =
  fromDefault<Attribute> ({
    id: '',
    name: '',
    short: '',
    category: Categories.ATTRIBUTES,
  })

export const AttributeG = makeGetters (AttributeCreator)

export const createAttribute =
  (xs: Omit<Attribute, 'category'>) => AttributeCreator ({
    ...xs,
    category: Categories.ATTRIBUTES,
  })

export const isAttribute =
  (r: EntryWithCategory) => AttributeG.category (r) === Categories.ADVANTAGES
