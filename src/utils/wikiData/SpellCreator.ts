import { Categories } from '../../constants/Categories';
import { Spell } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const SpellCreator =
  fromDefault<Spell> ({
    id: '',
    name: '',
    category: Categories.SPELLS,
    check: List.empty,
    checkmod: Nothing,
    gr: 0,
    ic: 0,
    property: 0,
    tradition: List.empty,
    subtradition: List.empty,
    prerequisites: List.empty,
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

export const SpellG = makeGetters (SpellCreator)

export const createSpell: RequiredExceptCategoryFunction<Spell> =
  SpellCreator
