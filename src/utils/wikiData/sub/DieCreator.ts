import { Die } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const DieCreator =
  fromDefault<Die> ({
    amount: 0,
    sides: 0,
  })

export const DieG = makeGetters (DieCreator)

export const createDie = (amount: number) => (sides: number) => DieCreator ({ amount, sides })
