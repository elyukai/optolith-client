import { Categories } from '../../constants/Categories';
import { Blessing } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const BlessingCreator =
  fromDefault<Blessing> ({
    id: '',
    name: '',
    aspects: List.empty,
    tradition: List.empty,
    category: Categories.BLESSINGS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    src: List.empty,
  })

export const BlessingG = makeGetters (BlessingCreator)

export const createBlessing: RequiredExceptCategoryFunction<Blessing> =
  BlessingCreator
