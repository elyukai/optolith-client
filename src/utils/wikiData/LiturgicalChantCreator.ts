import { Categories } from '../../constants/Categories';
import { LiturgicalChant } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const LiturgicalChantCreator =
  fromDefault<LiturgicalChant> ({
    id: '',
    name: '',
    aspects: List.empty,
    category: Categories.LITURGIES,
    check: List.empty,
    checkmod: Nothing,
    gr: 0,
    ic: 0,
    tradition: List.empty,
    effect: '',
    castingTime: '',
    castingTimeShort: '',
    cost: '',
    costShort: '',
    range: '',
    rangeShort: '',
    duration: '',
    durationShort: '',
    target: '',
    src: List.empty,
  })

export const LiturgicalChantG = makeGetters (LiturgicalChantCreator)

export const createLiturgicalChant: RequiredExceptCategoryFunction<LiturgicalChant> =
  LiturgicalChantCreator
