import { Categories } from '../../constants/Categories';
import { Attribute } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const AttributeCreator =
  fromDefault<Attribute> ({
    id: '',
    name: '',
    short: '',
    category: Categories.ATTRIBUTES,
  })

export const AttributeG = makeGetters (AttributeCreator)

export const createAttribute: RequiredExceptCategoryFunction<Attribute> =
  AttributeCreator
