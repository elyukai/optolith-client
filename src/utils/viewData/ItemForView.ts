import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault } from '../structures/Record';

export interface ItemForView {
  id: string
  name: string
  amount: number
  price: Maybe<number>
  weight: Maybe<number>
  where: Maybe<string>
  gr: number
}

export const ItemForView =
  fromDefault<ItemForView> ({
    id: '',
    name: '',
    amount: 0,
    price: Nothing,
    weight: Nothing,
    where: Nothing,
    gr: 0,
  })
