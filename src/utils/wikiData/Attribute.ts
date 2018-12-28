import { Categories } from '../../constants/Categories';
import { EntryWithCategory } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';

export interface Attribute {
  id: string
  name: string
  category: Categories
  short: string
}

export const Attribute =
  fromDefault<Attribute> ({
    id: '',
    name: '',
    short: '',
    category: Categories.ATTRIBUTES,
  })

export const AttributeG = makeGetters (Attribute)

export const isAttribute =
  (r: EntryWithCategory) => AttributeG.category (r) === Categories.ATTRIBUTES
