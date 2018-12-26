import { Categories } from '../../constants/Categories';
import { EntryWithCategory, LiturgicalChant } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

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

export const createLiturgicalChant =
  (xs: Omit<LiturgicalChant, 'category'>) => LiturgicalChantCreator ({
    ...xs,
    category: Categories.LITURGIES,
  })

export const isLiturgicalChant =
  (r: EntryWithCategory) => LiturgicalChantG.category (r) === Categories.LITURGIES
