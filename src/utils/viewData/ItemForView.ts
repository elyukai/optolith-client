import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export interface ItemForView {
  id: string
  name: string
  amount: number
  price: Maybe<number>
  weight: Maybe<number>
  where: Maybe<string>
  gr: number
}

const ItemForViewCreator =
  fromDefault<ItemForView> ({
    id: '',
    name: '',
    amount: 0,
    price: Nothing,
    weight: Nothing,
    where: Nothing,
    gr: 0,
  })

export const ItemForViewG = makeGetters (ItemForViewCreator)
