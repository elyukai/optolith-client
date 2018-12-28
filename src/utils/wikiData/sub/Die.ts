import { fromDefault, makeGetters } from '../../structures/Record';

export interface Die {
  sides: number
  amount: number
}

export const Die =
  fromDefault<Die> ({
    amount: 0,
    sides: 0,
  })

export const DieG = makeGetters (Die)
