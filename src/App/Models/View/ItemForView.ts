import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Item } from "../Hero/Item";
import { ItemTemplate } from "../Wiki/ItemTemplate";

export interface ItemForView {
  "@@name": "ItemForView"
  id: string
  name: string
  amount: number
  price: Maybe<number>
  weight: Maybe<number>
  where: Maybe<string>
  gr: number
}

export const ItemForView =
  fromDefault ("ItemForView")
              <ItemForView> ({
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
      id: Item.A.id (x),
      name: Item.A.name (x),
      amount: Item.A.amount (x),
      price: Item.A.price (x),
      weight: Item.A.weight (x),
      where: Item.A.where (x),
      gr: Item.A.gr (x),
    })

export const itemTemplateToItemForView =
  (x: Record<ItemTemplate>) =>
    ItemForView ({
      id: ItemTemplate.A.id (x),
      name: ItemTemplate.A.name (x),
      amount: 1,
      price: ItemTemplate.A.price (x),
      weight: ItemTemplate.A.weight (x),
      where: Nothing,
      gr: ItemTemplate.A.gr (x),
    })
