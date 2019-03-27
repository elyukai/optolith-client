import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Item } from "../Hero/Item";
import { ItemTemplate } from "../Wiki/ItemTemplate";

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
    id: "",
    name: "",
    amount: 0,
    price: Nothing,
    weight: Nothing,
    where: Nothing,
    gr: 0,
  })

export const itemToItemForView =
  (x: Record<Item>) =>
    ItemForView ({
      id: Item.A_.id (x),
      name: Item.A_.name (x),
      amount: Item.A_.amount (x),
      price: Item.A_.price (x),
      weight: Item.A_.weight (x),
      where: Item.A_.where (x),
      gr: Item.A_.gr (x),
    })

export const itemTemplateToItemForView =
  (x: Record<ItemTemplate>) =>
    ItemForView ({
      id: ItemTemplate.A_.id (x),
      name: ItemTemplate.A_.name (x),
      amount: 1,
      price: ItemTemplate.A_.price (x),
      weight: ItemTemplate.A_.weight (x),
      where: Nothing,
      gr: ItemTemplate.A_.gr (x),
    })
