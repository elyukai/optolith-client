import { Categories } from '../constants/Categories';
import { Spell } from '../types/wiki';
import { List } from './structures/List';
import { Nothing } from './structures/Maybe';
import { fromDefault, makeGetters, makeLenses_ } from './structures/Record';

export const SpellCreator =
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
export const SpellL = makeLenses_ (SpellG) (SpellCreator)
