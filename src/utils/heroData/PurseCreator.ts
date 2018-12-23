import { Purse } from '../../types/data';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

/**
 * Create a new `Purse` object.
 */
export const PurseCreator =
  fromDefault<Purse> ({
    d: '',
    s: '',
    h: '',
    k: '',
  })

export const PurseG = makeGetters (PurseCreator)
export const PurseL = makeLenses_ (PurseG) (PurseCreator)
