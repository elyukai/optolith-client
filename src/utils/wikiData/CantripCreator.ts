import { Categories } from '../../constants/Categories';
import { Cantrip } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const CantripCreator =
  fromDefault<Cantrip> ({
    id: '',
    name: '',
    property: 0,
    tradition: List.empty,
    category: Categories.CANTRIPS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    note: Nothing,
    src: List.empty,
  })

export const CantripG = makeGetters (CantripCreator)

export const createCantrip: RequiredExceptCategoryFunction<Cantrip> =
  CantripCreator
